import slugify from '@sindresorhus/slugify';
import path from 'path';

import { encodeAccount } from './urlParser';

import { PROJECT_FOLDER, ACCOUNT_INFO_FILE } from '../constants/core';

const posixPath = path.posix;

export default class Account {
  static async load(key, Hyperdrive, database, projectStore) {
    const account = new Account(key, Hyperdrive, database, projectStore);

    await account.init();

    return account;
  }

  constructor(key, Hyperdrive, database, projectStore) {
    this.key = key;
    this.Hyperdrive = Hyperdrive;
    this.database = database;
    this.projectStore = projectStore;
  }

  get url() {
    return encodeAccount(this.archive.key);
  }

  async init() {
    this.archive = this.Hyperdrive(this.key);

    await this.archive.ready();
  }

  async getProjects() {
    if (this.projects) return this.projects;
    const projectNames = await this.archive.readdir(PROJECT_FOLDER);

    this.projects = await Promise.all(
      projectNames.map(async name => {
        return this.projectStore.get(name);
      })
    );

    return this.projects;
  }

  async getProjectsInfo () {
	const projects = await this.getProjects()

	return Promise.all(projects.map(async (project) => {
		const info = await project.getInfo()

		const url = project.url

		return {...info, url}
	}))
  }

  async createProject(info) {
    const projects = await this.getProjects();

    const { title } = info;
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

    await project.updateInfo(info);

    projects.push(project);

    return project;
  }

  async getInfo() {
      const key = this.key.toString('hex')
    try {
      const raw = await this.archive.readFile(ACCOUNT_INFO_FILE, 'utf8');
      const parsed = JSON.parse(raw);

      return {name: key, ...parsed, key}
    } catch (e) {
      return {name: key, key};
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
}
