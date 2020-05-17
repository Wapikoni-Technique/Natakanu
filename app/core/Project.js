import { dialog } from 'electron';
import {
  parse as parsePath,
  join as joinPaths,
  basename as pathBasename
} from 'path';
import fs from 'fs-extra';
import pump from 'pump-promise';
import reallyReady from 'hypercore-really-ready';
import readdir from 'readdir-enhanced';

import { encodeProject } from './urlParser';
import { PROJECT_INFO_FILE } from '../constants/core';

export default class Project {
  static async load(key, Hyperdrive, db) {
    const project = new Project(key, Hyperdrive, db);

    await project.init();

    return project;
  }

  constructor(key, Hyperdrive, db) {
    this.key = key;
    this.Hyperdrive = Hyperdrive;
    this.db = db;
  }

  get url() {
    return encodeProject(this.archive.key);
  }

  async init() {
    this.archive = this.Hyperdrive(this.key);

    await this.archive.ready();

    await reallyReady(this.archive.metadata);
  }

  async getInfo() {
    const key = this.key.toString('hex');
    const { url } = this;
    const { writable } = this.archive;
    try {
      const raw = await this.archive.readFile(PROJECT_INFO_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      const final = { title: key, ...parsed, key, url, writable };
      return final;
    } catch (e) {
      return { title: key, key, url, writable };
    }
  }

  async updateInfo(info) {
    const existing = await this.getInfo();

    const updated = { ...existing, ...info };

    const stringified = JSON.stringify(updated, null, '\t');

    await this.archive.writeFile(PROJECT_INFO_FILE, stringified);

    return updated;
  }

  async getFileList(path = '/') {
    return this.archive.readdir(path, { includeStats: true });
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
