import SDK from 'dat-sdk';
import envPaths from 'env-paths';
import levelup from 'levelup';
import leveldown from 'leveldown';
import encodingdown from 'encoding-down';
import EventEmitter from 'events';
import path from 'path';
import fs from 'fs-extra';
import datGossip from 'dat-gossip';
import hasha from 'hasha';

import { APPLICATION_NAME, GOSSIP_KEY } from '../constants/core';

import Database from './Database';
import ProjectStore from './ProjectStore';
import AccountStore from './AccountStore';

export default class NatakanuCore extends EventEmitter {
  constructor({
    applicationName = APPLICATION_NAME,
    gossipKey = GOSSIP_KEY,
    db,
    sdk
  }) {
    super();
    this.sdk = sdk;
    this.db = db;
    this.applicationName = applicationName || APPLICATION_NAME;
    this.gossipKey = gossipKey || GOSSIP_KEY;
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

    const gossipCoreKey = hasha(this.gossipKey).slice(0, 64);

    this.gossipCore = this.sdk.Hypercore(gossipCoreKey);

    console.log('Gossip Core', this.gossipKey, gossipCoreKey.length);

    const { publicKey: id } = await this.sdk.getIdentity();

    await this.gossipCore.ready();

    this.gossip = datGossip(this.gossipCore, { id });

    this.database = new Database(this.db);
    this.projects = new ProjectStore(this.sdk.Hyperdrive, this.database);
    this.accounts = new AccountStore(
      this.sdk.Hyperdrive,
      this.database,
      this.projects,
      this.gossip
    );

    await this.accounts.startGossip();

    // Load up any projects we saved
    // This should also start loading their latest data
    await this.projects.getSaved();
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
