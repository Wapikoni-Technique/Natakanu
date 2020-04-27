import EventEmitter from 'events';

import { parseURL } from './urlParser';
import Account from './Account';

import { ACCOUNT_ARCHIVE_NAME } from '../constants/core';

// This ensures a project doesn't get initialized more than once

export default class AccountStore extends EventEmitter {
  constructor(Hyperdrive, database, projectStore) {
    super();
    this.Hyperdrive = Hyperdrive;
    this.database = database;
    this.projectStore = projectStore;
    this.accounts = new Map();
  }

  async create(...args) {
    let name = ACCOUNT_ARCHIVE_NAME;
    let opts = {};
    if (args.length === 1) {
      [opts] = args;
    } else if (args.length > 1) {
      [name, opts] = args;
    }
    const account = await this.get(name);

    await account.updateInfo(opts);

    await this.database.addAccountName(name);

    return account;
  }

  async get(name) {
    const { key } = parseURL(name);

    if (this.accounts.has(key)) return this.accounts.get(key);

    const account = await Account.load(
      key,
      this.Hyperdrive,
      this.database,
      this.projectStore
    );

    this.accounts.set(name, account);
    this.accounts.set(account.url, account);
    this.accounts.set(key, account);

    this.emit('account', account);

    return account;
  }

  async list() {
    const names = await this.listNames();
    return Promise.all(names.map(name => this.get(name)));
  }

  async listNames() {
    return this.database.getAccountNames();
  }
}
