import slugify from '@sindresorhus/slugify';
import { parse as parsePath, posix as posixPath } from 'path';
import fs from 'fs';
import pump from 'pump';
import EventEmitter from 'events';

import { encodeAccount } from './urlParser';

import { PROJECT_FOLDER, ACCOUNT_INFO_FILE } from '../constants/core';

export default class Account extends EventEmitter {
  static async load(key, Hyperdrive, database, projectStore) {
    const account = new Account(key, Hyperdrive, database, projectStore);

    await account.init();

    return account;
  }

  constructor(key, Hyperdrive, database, projectStore) {
    super();
    this.key = key;
    this.Hyperdrive = Hyperdrive;
    this.database = database;
    this.projectStore = projectStore;
  }

  get url() {
    return encodeAccount(this.archive.key);
  }

  get writable() {
    return this.archive.writable;
  }

  get peers() {
    return this.archive.peers || [];
  }

  async init() {
    this.archive = this.Hyperdrive(this.key);

    this.archive.on('update', () => this.emit('update', 'update'));
    this.archive.on('peer-open', () => this.emit('update', 'peer-open'));
    this.archive.on('peer-remove', () => this.emit('update', 'peer-remove'));

    await this.archive.ready();
  }

  async getProjects() {
    if (this.projects) return this.projects;

    if (this.writable) {
      const projectNames = await this.archive.readdir(PROJECT_FOLDER);

      this.projects = await Promise.all(
        projectNames.map(async name => {
          return this.projectStore.get(name);
        })
      );

      return this.projects;
    }

    // This must be a remotely loaded archive
    // Get the stats for all the subfolders
    const stats = await this.archive.readdir(PROJECT_FOLDER, {
      includeStats: true
    });

    // Get the keys from the mount info and init the projects
    return Promise.all(
      stats.map(({ stat }) => {
        return this.projectStore.get(stat.mount.key.toString('hex'));
      })
    );
  }

  async getProjectsInfo() {
    const projects = await this.getProjects();

    return Promise.all(
      projects.map(async project => {
        const info = await project.getInfo();

        const { url } = project;

        return { ...info, url };
      })
    );
  }

  async createProject(info) {
    if (!this.writable) {
      throw new Error('Unable to create project: Not Writable');
    }

    const projects = await this.getProjects();

    const { title, image: imagePath } = info;
    const opts = info;
    // Slugify the name
    const key = slugify(`${this.key}  ${title}`);

    // Initialize an archive using it as a namespace
    const archive = await this.Hyperdrive(key);

    await archive.ready();

    // Mount the archive in a folder with the slugified name
    const mountLocation = posixPath.join(PROJECT_FOLDER, key);

    await this.archive.mount(mountLocation, archive.key);

    // Initialize the project for it
    const project = await this.projectStore.get(key);

    if (imagePath) {
      const { base: imageName } = parsePath(imagePath);

      const destination = `/${imageName}`;

      await project.saveFromFS(imagePath, destination);
      opts.image = `hyper://${archive.key.toString('hex')}/${imageName}`;
    }

    await project.updateInfo(opts);

    projects.push(project);

    return project;
  }

  async getInfo() {
    const key = this.key.toString('hex');
    const { writable } = this;
    try {
      const raw = await this.archive.readFile(ACCOUNT_INFO_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      return { name: key, ...parsed, key, writable };
    } catch (e) {
      console.error(e);
      return { name: key, key, writable };
    }
  }

  async updateInfo(info) {
    let existing = {};
    try {
      existing = await this.getInfo();
    } catch {
      // Whatever
    }

    const updated = { ...existing, ...info };

    const stringified = JSON.stringify(updated, null, '\t');

    await this.archive.writeFile(ACCOUNT_INFO_FILE, stringified);

    return updated;
  }

  async saveFromFS(filePath) {
    const { base: fileName } = parsePath(filePath);

    const destination = `/${fileName}`;

    const writeStream = this.archive.createWriteStream(destination);
    const readStream = fs.createReadStream(filePath);

    await pump(readStream, writeStream);

    return fileName;
  }
}
