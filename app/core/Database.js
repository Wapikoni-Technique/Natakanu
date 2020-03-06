import {
  ACCOUNT_DB_PREFIX,
  RECENT_PROJECT_DB_PREFIX,
  MAX_RECENT_PROJECTS
} from '../constants/core';

export default class Database {
  constructor(db) {
    this.db = db;
  }

  async getAccountNames() {
    try {
      await this.db.get(ACCOUNT_DB_PREFIX);
    } catch (e) {
      return [];
    }
  }

  async setAccountNames(names) {
    await this.db.put(ACCOUNT_DB_PREFIX, names);
  }

  async addAccountName(name) {
    const names = await this.getAccountNames();

    const dedupled = new Set(names.concat(name));

    const final = [...dedupled];

    await this.setAccountNames(final);
  }

  async getRecentProjectNames() {
    try {
      return await this.db.get(RECENT_PROJECT_DB_PREFIX);
    } catch {
      return [];
    }
  }

  async setRecentProjectNames(names) {
    await this.db.put(RECENT_PROJECT_DB_PREFIX, names);
  }

  async addRecentProjectName(name) {
    const names = await this.getRecentProjectNames();

    names.unshift(name);

    while (names.length > MAX_RECENT_PROJECTS) names.pop();

    await this.setRecentProjectNames(names);
  }
}
