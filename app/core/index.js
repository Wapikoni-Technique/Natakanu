import SDK from 'dat-sdk';
import envPaths from 'env-paths';
import levelup from 'levelup';
import leveldown from 'leveldown';
import encodingdown from 'encoding-down';
import EventEmitter from 'events';
import path from 'path';
import fs from 'fs-extra';

import { APPLICATION_NAME } from '../constants/core';

import Database from './Database';
import ProjectStore from './ProjectStore';
import AccountStore from './AccountStore';
import Preferences from './Preferences';
import SuperPeer from './SuperPeer';
import Search from './Search';
import Gossip from './Gossip';

export default class NatakanuCore extends EventEmitter {
  constructor({ applicationName = APPLICATION_NAME, gossipKey, db, sdk }) {
    super();
    this.sdk = sdk;
    this.db = db;
    this.applicationName = applicationName || APPLICATION_NAME;
    this.gossipKey = gossipKey;
  }

  async init() {
    const { applicationName } = this;
    const dataPath = envPaths(applicationName).data;
    if (!this.db) {
      const dbPath = path.join(dataPath, 'levelup');
      const dbOptions = {
        valueEncoding: 'json'
      };

      await fs.ensureDir(dbPath);
      this.db = levelup(encodingdown(leveldown(dbPath), dbOptions));
    }
    if (!this.sdk) {
      this.sdk = await SDK({
        applicationName
      });
    }

    this.database = new Database(this.db);

    const { publicKey: id } = await this.sdk.getIdentity();

    this.gossip = new Gossip(
      id,
      this.sdk.Hypercore,
      this.database,
      this.gossipKey
    );

    console.log('Initializing gossip', this.gossipKey);
    await this.gossip.init();
    console.log('Done!');

    this.projects = new ProjectStore(this.sdk.Hyperdrive, this.database);

    this.accounts = new AccountStore(
      this.sdk.Hyperdrive,
      this.database,
      this.projects,
      this.gossip
    );

    this.preferences = new Preferences(this.database);

    this.superpeer = new SuperPeer(
      this.accounts,
      this.gossip,
      this.preferences
    );

    this.searcher = new Search(this.projects, this.accounts);

    await this.superpeer.init();

    await this.accounts.startGossip();

    // Load up any projects we saved
    // This should also start loading their latest data
    await this.projects.getSaved();
  }

  search(query, opts = {}) {
    return this.searcher.search(query, opts);
  }

  async close() {
    await Promise.all([this.sdk.close(), this.db.close()]);
  }

  static async create(opts) {
    const core = new NatakanuCore(opts || {});

    await core.init();

    return core;
  }
}
