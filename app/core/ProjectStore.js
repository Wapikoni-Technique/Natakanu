import { parseURL } from './urlParser';
import Project from './Project';

// This ensures a project doesn't get initialized more than once

export default class ProjectStore {
  constructor(Hyperdrive, database) {
    this.Hyperdrive = Hyperdrive;
    this.database = database;
    this.projects = new Map();
  }

  async get(name) {
    const { key } = parseURL(name);

    if (this.projects.has(key)) return this.projects.get(key);

    console.log('Getting project for', { name, key });

    const project = await Project.load(name, this.Hyperdrive, this.database);

    this.projects.set(name, project);
    this.projects.set(project.url, project);
    this.projects.set(key, project);
    this.projects.set(project.archive.key.toString('hex'), project);

    project.once('close', () => {
      console.log('Project closed');
      this.projects.delete(name);
      this.projects.delete(project.url);
      this.projects.delete(key);
      this.projects.delete(project.archive.key.toString('hex'));
    });

    return project;
  }

  async addRecent(key) {
    return this.database.addRecentProjectName(key);
  }

  async getRecent() {
    const names = await this.getRecentNames();

    const projects = await Promise.all(names.map(name => this.get(name)));

    const isEmpty = await Promise.all(
      projects.map(project => project.isEmpty())
    );

    const nonEmpty = projects.filter((project, index) => !isEmpty[index]);

    return nonEmpty;
  }

  async getRecentNames() {
    return this.database.getRecentProjectNames();
  }

  async getSaved() {
    const names = await this.getSavedNames();

    return Promise.all(names.map(name => this.get(name)));
  }

  async getSavedNames() {
    return this.database.getSavedProjectNames();
  }
}
