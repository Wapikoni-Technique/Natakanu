import { dialog } from 'electron';
import {
  parse as parsePath,
  join as joinPaths,
  basename as pathBasename,
  sep
} from 'path';
import fs from 'fs-extra';
import pump from 'pump-promise';
import readdir from 'readdir-enhanced';
import EventEmitter from 'events';
import isDownloaded from 'hyperdrive-is-downloaded';
import coHyperdrive from 'co-hyperdrive';
import hyperdrivePromise from '@geut/hyperdrive-promise';

import { encodeProject } from './urlParser';
import { PROJECT_INFO_FILE, PROJECT_INFO_FILE_BACKUP } from '../constants/core';

const MATCH_SEP = /\\/g;

export default class Project extends EventEmitter {
  static async load(key, Hyperdrive, database) {
    const project = new Project(key, Hyperdrive, database);

    await project.init();

    return project;
  }

  constructor(key, Hyperdrive, database) {
    super();
    this.key = key;
    this.Hyperdrive = Hyperdrive;
    this.database = database;
    this.isDownloading = null;
    this.uploading = new Set();
  }

  get url() {
    return encodeProject(this.archive.key);
  }

  get writable() {
    return this.archive.writable;
  }

  get peers() {
    return this.archive.peers || [];
  }

  get closed() {
    return this.archive.closed;
  }

  async onAuth(key, peer, sendAuthorization) {
    try {
      const authStrategy = await this.getWriterAuthStrategy();
      const allowed = authStrategy === 'allow';
      sendAuthorization(allowed);
      this.emit('update', 'add-writer');
    } catch (e) {
      sendAuthorization(false);
    }
  }

  async requestWrite() {
    if (this.writable) return;

    const writer = this.Hyperdrive(`writer-${this.key.slice(-1)}`, {
      announce: false,
      lookup: false
    });

    await writer.ready();

    const { key } = writer;

    await new Promise((resolve, reject) => {
      this.archive.requestAuthorization(key, (err, granted) => {
        if (granted) return resolve(key);
        reject(err || new Error('Authorization Denied'));
      });
    });

    this.emit('update', 'got-writer');
  }

  async init() {
    this.archive = hyperdrivePromise(
      coHyperdrive(this.Hyperdrive, this.key, {
        onAuth: (...args) => this.onAuth(...args)
      })
    );

    await this.archive.ready();

    this.archive.on('peer-open', () => this.emit('update', 'peer-open'));
    this.archive.on('peer-remove', () => this.emit('update', 'peer-remove'));
    this.archive.watch('/', () => {
      this.emit('update', 'update');
    });
    this.archive.on('drive-add', drive => {
      this.emit('update', 'drive-add');
      console.log('Listening on new writer');
      drive.watch('/', () => {
        console.log('New writer updated');
        this.emit('update', 'update');
      });
      drive.getContent((err, feed) => {
        feed.on('download', (index, block) => {
          this.emit('update', 'download', index, block);
        });
      });
    });
    this.archive.primary.ready(() => {
      this.archive.primary.watch('/', () => {
        console.log('New writer updated');
        this.emit('update', 'update');
      });
      this.archive.primary.getContent((err, feed) => {
        feed.on('download', (index, block) => {
          this.emit('update', 'download', index, block);
        });
      });
    });
    this.archive.on('drive-remove', () => {
      this.emit('update', 'drive-remove');
    });
    this.archive.on('close', () => {
      this.emit('close');
    });

    const isSaved = await this.isSaved();
    const { writable } = this;

    const shouldDownload = !writable && isSaved;

    if (shouldDownload) {
      this.startDownloading();
    }
  }

  async isEmpty() {
    const files = await this.archive.readdir('/');

    return files.length === 0;
  }

  async getInfo() {
    const key = this.key.toString('hex');
    const { url } = this;
    const { writable } = this.archive;
    const isSaved = await this.isSaved();
    try {
      let raw = null;
      try {
        raw = await this.archive.readFile(PROJECT_INFO_FILE, 'utf8');
      } catch {
        raw = await this.archive.readFile(PROJECT_INFO_FILE_BACKUP, 'utf8');
      }
      const parsed = JSON.parse(raw);
      const final = {
        title: key,
        ...parsed,
        key,
        url,
        writable,
        isSaved
      };
      return final;
    } catch (e) {
      console.error(e);
      return { title: key, key, url, writable, isSaved };
    }
  }

  async updateInfo(info) {
    const existing = await this.getInfo();

    const updated = {
      ...existing,
      ...info,
      writable: undefined,
      isSaved: undefined
    };

    const stringified = JSON.stringify(updated, null, '\t');

    await this.archive.writeFile(PROJECT_INFO_FILE, stringified);

    return updated;
  }

  async getWriterAuthStrategy() {
    const { authStrategy = 'deny' } = await this.getInfo();

    return authStrategy;
  }

  async setWriterAuthStrategy(authStrategy) {
    await this.updateInfo({ authStrategy });
  }

  async updateImage(imagePath) {
    const { base: imageName } = parsePath(imagePath);

    const destination = `/${imageName}`;

    await this.saveFromFS(imagePath, destination);

    const image = `hyper://${this.archive.key.toString('hex')}/${imageName}`;

    await this.updateInfo({ image });
  }

  async isSaved() {
    const { url, writable } = this;

    if (writable) return true;
    const saved = await this.database.getSavedProjectNames();

    return saved.includes(url);
  }

  async setSaved(saved) {
    const { url, writable } = this;

    if (writable) return;

    if (saved) {
      await this.database.addSavedProjectName(url);
      this.startDownloading();
    } else {
      await this.database.removeSavedProjectName(url);
      this.stopDownloading();
    }

    this.emit('update');
  }

  async isDownloaded(path) {
    return new Promise((resolve, reject) => {
      isDownloaded(this.archive, path, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  startDownloading() {
    if (this.isDownloading) return;
    this.isDownloading = () => this.archive.download('/');
    this.archive.on('update', this.isDownloading);
    this.isDownloading();
  }

  stopDownloading() {
    if (!this.isDownloading) return;
    this.archive.removeListener('update', this.isDownloading);
    this.isDownloading = null;
  }

  async getFileList(path = '/') {
    const stats = await this.archive.readdir(path, { includeStats: true });

    return Promise.all(
      stats.map(async ({ stat, name }) => {
        const fullPath = joinPaths(path, name);
        const downloaded = await this.getDownloadPercent(fullPath);
        const newStat = Object.create(stat);
        newStat.isDownloaded = downloaded;

        return { stat: newStat, name };
      })
    );
  }

  getUploading() {
    return [...this.uploading];
  }

  async deleteFile(path) {
    await this.archive.clear(path);
    return this.archive.unlink(path);
  }

  async clear(path) {
    try {
      await this.archive.clear(path);
    } catch (e) {
      // Whatever
    }
    this.emit('update', 'cleared');
  }

  async deleteFolder(path) {
    const stats = await this.archive.readdir(path, { includeStats: true });

    await Promise.all(
      stats.map(async ({ stat, name }) => {
        if (stat.isDirectory()) await this.deleteFolder(joinPaths(path, name));
        await this.deleteFile(joinPaths(path, name));
      })
    );
  }

  async getDownloadPercent(path) {
    const { blocks, downloadedBlocks } = await this.archive.stats(path);

    return downloadedBlocks / blocks;
  }

  async showSaveFile(path) {
    const { base: defaultPath } = parsePath(path);
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath
    });

    if (canceled) throw new Error('Canceled file save');

    const normalizedPath = normalizePath(path);

    const readStream = this.archive.createReadStream(normalizedPath);
    const writeStream = fs.createWriteStream(filePath);

    await pump(readStream, writeStream);

    return {
      filePath
    };
  }

  async showLoadFile(basePath = '/', folders = false) {
    const properties = folders
      ? ['openDirectory', 'multiSelections']
      : ['openFile', 'multiSelections'];
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties
    });

    // If they cancelled, whatever
    if (canceled) return { filePaths: [] };

    for (const filePath of filePaths) {
      const stat = await fs.stat(filePath);

      console.log('Uploading', filePath, stat);

      if (stat.isDirectory()) {
        const folderName = pathBasename(filePath);
        const searchOpts = {
          deep: true,
          filter: stats => stats.isFile()
        };
        for await (const subpath of readdir.iterator(filePath, searchOpts)) {
          const destination = joinPaths(basePath, folderName, subpath);
          const source = joinPaths(filePath, subpath);

          await this.saveFromFS(source, destination);
        }
      } else {
        const { base: fileName } = parsePath(filePath);
        const destination = joinPaths(basePath, fileName);
        await this.saveFromFS(filePath, destination);
      }

      console.log('Uploaded', filePath);
    }

    return {
      filePaths
    };
  }

  async saveFromFS(fsFile, destinationFile) {
    const normalizedDest = normalizePath(destinationFile);
    const writeStream = this.archive.createWriteStream(normalizedDest);
    const readStream = fs.createReadStream(fsFile);

    this.uploading.add(normalizedDest);
    this.emit('update', 'uploaded', normalizedDest);

    await pump(readStream, writeStream);

    this.emit('update', 'uploaded', normalizedDest);

    delete this.uploading.delete(normalizedDest);
  }

  async destroy(force) {
    if (!force) {
      const { response } = await dialog.showMessageBox({
        type: 'question',
        buttons: ['cancel', 'confirm'],
        message: 'Are you sure you want to delete this project?'
      });

      // Confirm button was pressed, cancel destroy
      if (!response) {
        console.debug('Destroy cancelled');
        return false;
      }
    }

    await this.deleteFolder('/');

    // Clear out all the hyperdrive-specific storage
    await new Promise((resolve, reject) => {
      // TODO: Get this merged into hyperdrive proper
      /* eslint-disable no-underscore-dangle */
      this.archive._getContent(this.archive.db.feed, (err1, contentState) => {
        if (err1) return reject(err1);
        const content = contentState.feed;
        content.clear(0, content.length, err2 => {
          if (err2) reject(err2);
          else resolve();
        });
      });
    });

    return true;
  }
}

function normalizePath(path) {
  if (sep === '/') return path;
  return path.replace(MATCH_SEP, '/');
}
