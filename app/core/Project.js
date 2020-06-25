import { dialog } from 'electron';
import {
  parse as parsePath,
  join as joinPaths,
  basename as pathBasename
} from 'path';
import fs from 'fs-extra';
import pump from 'pump-promise';
import readdir from 'readdir-enhanced';
import EventEmitter from 'events';
import isDownloaded from 'hyperdrive-is-downloaded';

import { encodeProject } from './urlParser';
import { PROJECT_INFO_FILE, PROJECT_INFO_FILE_BACKUP } from '../constants/core';

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

  async init() {
    this.archive = this.Hyperdrive(this.key);

    await this.archive.ready();

    this.archive.on('update', () => this.emit('update', 'update'));
    this.archive.on('peer-open', () => this.emit('update', 'peer-open'));
    this.archive.on('peer-remove', () => this.emit('update', 'peer-remove'));

    const isSaved = await this.isSaved();
    const { writable } = this;

    const shouldDownload = !writable && isSaved;

    if (shouldDownload) {
      this.startDownloading();
    }
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
        const downloaded = await this.isDownloaded(joinPaths(path, name));
        const newStat = Object.create(stat);
        newStat.isDownloaded = downloaded;

        return { stat: newStat, name };
      })
    );
  }

  async deleteFile(path) {
    return this.archive.unlink(path);
  }

  async showSaveFile(path) {
    const { base: defaultPath } = parsePath(path);
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath
    });

    if (canceled) throw new Error('Canceled file save');

    const readStream = this.archive.createReadStream(path);
    const writeStream = fs.createWriteStream(filePath);

    await pump(readStream, writeStream);

    return {
      filePath
    };
  }

  async showLoadFile(basePath = '/') {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      // properties: ['openFile', 'openDirectory', 'multiSelections']
    });

    // If they cancelled, whatever
    if (canceled) return { filePaths: [] };

    for (const filePath of filePaths) {
      const stat = await fs.stat(filePath);

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
    }

    return {
      filePaths
    };
  }

  async saveFromFS(fsFile, destinationFile) {
    const writeStream = this.archive.createWriteStream(destinationFile);
    const readStream = fs.createReadStream(fsFile);

    await pump(readStream, writeStream);
  }
}
