import EventEmitter from 'events';

import { parseURL } from './urlParser';
import Account from './Account';

import { ACCOUNT_ARCHIVE_NAME, ACCOUNT_INFO_FILE } from '../constants/core';

// This ensures a project doesn't get initialized more than once

export default class AccountStore extends EventEmitter {
  constructor(Hyperdrive, database, projectStore, gossip) {
    super();
    this.Hyperdrive = Hyperdrive;
    this.database = database;
    this.projectStore = projectStore;
    this.accounts = new Map();
    this.gossip = gossip;
  }

  async startGossip() {
    // Whenever we load an account we start advertising it
    // Listing our existing accounts should be enough?
    await this.list();
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

    const { image: imagePath } = opts;

    if (imagePath) {
      const imageName = await account.saveFromFS(imagePath);
      opts.image = `hyper://${account.archive.key.toString(
        'hex'
      )}/${imageName}`;
    }

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

    // Check if the account is local
    if (account.writable) {
      try {
        // Check if this account was properly initialized
        await account.archive.stat(ACCOUNT_INFO_FILE);
      } catch (e) {
        // We don't have a dat.json so we should make one
        await account.updateInfo({ name: key });
        await this.database.addAccountName(key);
      }
    } else {
      // Add the account to recents after loading their info
      // This shouldn't block the rest of the loading
      account
        .getInfo()
        .then(() => {
          return this.database.addSeenAccount(account.url);
        })
        .catch(e => {
          console.error('Error saving account to saved', e.stack);
        });
    }

    this.accounts.set(name, account);
    this.accounts.set(account.url, account);
    this.accounts.set(account.archive.key.toString('hex'), account);
    this.accounts.set(key, account);

    if (account.writable) this.gossip.advertise(account.archive.key, true);

    return account;
  }

  async listGossipedInfo() {
    const keys = this.gossip.list();

    return Promise.all(
      keys.map(async key => {
        const account = await this.get(key.toString('hex'));
        const info = await account.getInfo();

        return info;
      })
    );
  }

  async listSeen() {
    const urls = await this.database.getSeenAccounts();
    return Promise.all(urls.map(url => this.get(url)));
  }

  async list() {
    const names = await this.listNames();
    console.log('Local account names', names);
    return Promise.all(names.map(name => this.get(name)));
  }

  async listNames() {
    return this.database.getAccountNames();
  }
}
