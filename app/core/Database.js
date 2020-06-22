import {
  ACCOUNT_DB_PREFIX,
  ACCOUNT_SEEN_DB_PREFIX,
  RECENT_PROJECT_DB_PREFIX,
  MAX_RECENT_PROJECTS,
  SAVED_PROJECT_DB_PREFIX,
  PREFERENCES_DB_KEY
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

  async addSeenAccount(url) {
    const seen = await this.getSeenAccounts();

    const dedupled = new Set(seen.concat(url));

    const final = [...dedupled];

    await this.setAccountNames(final);
  }

  async getSeenAccounts() {
    try {
      return await this.db.get(ACCOUNT_SEEN_DB_PREFIX);
    } catch (e) {
      console.log('Seen Accounts error', e);
      return [];
    }
  }

  async setSeenAccounts(seen) {
    await this.db.put(ACCOUNT_SEEN_DB_PREFIX, seen);
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

  async getPreference(name, defaultValue) {
    const preferences = await this.getPreferences();

    if (name in preferences) return preferences[name];
    return defaultValue;
  }

  async updatePreference(name, value) {
    const preferences = await this.getPreferences();

    const final = { ...preferences, [name]: value };

    await this.savePreferences(final);
  }

  async getPreferences() {
    try {
      const preferences = await this.db.get(PREFERENCES_DB_KEY);
      return preferences;
    } catch {
      return {};
    }
  }

  async savePreferences(preferences) {
    await this.db.put(PREFERENCES_DB_KEY, preferences);
  }
}
