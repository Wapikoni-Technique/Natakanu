import slugify from '@sindresorhus/slugify';
import { parse as parsePath, posix as posixPath } from 'path';
import fs from 'fs';
import pump from 'pump';
import EventEmitter from 'events';
import { dialog } from 'electron';

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
    this.archive.on('remote-update', () =>
      this.emit('remote-update', 'remote-update')
    );

    await this.archive.ready();
  }

  async getProjects() {
    let projects = null;

    if (this.writable) {
      const projectNames = await this.archive.readdir(PROJECT_FOLDER);

      projects = await Promise.all(
        projectNames.map(async name => {
          return this.projectStore.get(name);
        })
      );
    } else {
      // This must be a remotely loaded archive
      // Get the stats for all the subfolders
      const stats = await this.archive.readdir(PROJECT_FOLDER, {
        includeStats: true
      });

      // Get the keys from the mount info and init the projects
      projects = await Promise.all(
        stats.map(({ stat }) => {
          return this.projectStore.get(stat.mount.key.toString('hex'));
        })
      );
    }

    const notClosed = projects.filter(({ closed }) => !closed);

    // We should filter out any projects that are empty
    const projectEmptiness = await Promise.all(
      notClosed.map(project => project.isEmpty())
    );

    const nonEmpty = notClosed.filter(
      (project, index) => !project.closed && !projectEmptiness[index]
    );

    return nonEmpty;
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
      throw new Error('Unable to create project: Account Not Writable');
    }

    const projects = await this.getProjects();

    const { title } = info;
    const { image, ...opts } = info;

    // Slugify the name
    const key = slugify(`${this.key}  ${title}`);

    // Initialize an archive using it as a namespace
    const archive = await this.Hyperdrive(key);

    await archive.ready();

    // Mount the archive in a folder with the slugified name
    const mountLocation = posixPath.join(PROJECT_FOLDER, key);

    try {
      // Try reading the mount location
      // Will error out if it hasn''t already been mounted
      await this.archive.stat(mountLocation);
    } catch (e) {
      // Create the mount since it doesn't exist yet
      await this.archive.mount(mountLocation, archive.key);
    }

    // Initialize the project for it
    const project = await this.projectStore.get(key);

    await project.updateInfo(opts);

    if (image) {
      await project.updateImage(image);
    }

    projects.push(project);

    return project;
  }

  async getInfo() {
    const key = this.key.toString('hex');
    const { writable, url } = this;
    try {
      const raw = await this.archive.readFile(ACCOUNT_INFO_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      return { name: key, ...parsed, key, writable, url };
    } catch (e) {
      console.error(e);
      return { name: key, key, writable, url };
    }
  }

  async updateInfo(info) {
    let existing = {};
    try {
      existing = await this.getInfo();
    } catch {
      // Whatever
    }

    const updated = {
      ...existing,
      ...info,
      writable: undefined,
      url: undefined,
      key: undefined
    };

    const stringified = JSON.stringify(updated, null, '\t');

    await this.archive.writeFile(ACCOUNT_INFO_FILE, stringified);

    return updated;
  }

  async updateImage(filePath) {
    const imagePath = await this.saveFromFS(filePath);

    const image = `hyper://${this.archive.key.toString('hex')}/${imagePath}`;

    await this.updateInfo({ image });
  }

  async saveFromFS(filePath) {
    const { base: fileName } = parsePath(filePath);

    const destination = `/${fileName}`;

    const writeStream = this.archive.createWriteStream(destination);
    const readStream = fs.createReadStream(filePath);

    await pump(readStream, writeStream);

    return fileName;
  }

  async destroy(force) {
    if (!force) {
      const { response } = await dialog.showMessageBox({
        type: 'question',
        buttons: ['cancel', 'confirm'],
        message: 'Are you sure you want to delete this account?'
      });

      // Confirm button was pressed, cancel destroy
      if (!response) {
        console.debug('Destroy cancelled');
        return false;
      }
    }

    const projects = await this.getProjects();

    await Promise.all(
      projects.map(async project => {
        // Slugify the name
        const { key } = project;

        // Mount the archive in a folder with the slugified name
        const mountLocation = posixPath.join(PROJECT_FOLDER, key);

        await this.archive.unmount(mountLocation);

        if (await project.isEmpty()) return;

        await project.destroy(true);
      })
    );

    const stats = await this.archive.readdir('/', { includeStats: true });

    await Promise.all(
      stats.map(async ({ name }) => {
        return this.archive.unlink(name);
      })
    );

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

    await this.database.removeAccountName(this.key);

    this.emit('destroyed');

    return true;
  }
}
