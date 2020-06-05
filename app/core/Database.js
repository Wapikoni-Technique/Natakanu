import {
  ACCOUNT_DB_PREFIX,
  RECENT_PROJECT_DB_PREFIX,
  MAX_RECENT_PROJECTS,
  SAVED_PROJECT_DB_PREFIX
} from '../constants/core';

export default class Database {
  constructor(db) {
    this.db = db;
  }

  async getAccountNames() {
    try {
      return await this.db.get(ACCOUNT_DB_PREFIX);
    } catch (e) {
      console.log('Account names error', e);
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
    const finalNames = [name];

    for (const existing of names) {
      if (!finalNames.includes(existing)) finalNames.push(existing);
    }

    console.log('loaded names', names);

    while (finalNames.length > MAX_RECENT_PROJECTS) finalNames.pop();

    await this.setRecentProjectNames(finalNames);
  }

  async getSavedProjectNames() {
    try {
      return await this.db.get(SAVED_PROJECT_DB_PREFIX);
    } catch {
      return [];
    }
  }

  async setSavedProjectNames(names) {
    await this.db.put(SAVED_PROJECT_DB_PREFIX, names);
  }

  async addSavedProjectName(name) {
    const names = await this.getSavedProjectNames();

    if (names.includes(name)) return;

    names.push(name);

    await this.setSavedProjectNames(names);
  }

  async removeSavedProjectName(name) {
    const names = await this.getSavedProjectNames();

    const filtered = names.filter(existing => existing !== name);

    if (filtered.length === names.length) return;

    await this.setSavedProjectNames(filtered);
  }
}
