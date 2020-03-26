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

export default class NatakanuCore extends EventEmitter {
  constructor({ applicationName = APPLICATION_NAME, db, sdk }) {
    super();
    this.sdk = sdk;
    this.db = db;
    this.applicationName = applicationName || APPLICATION_NAME;
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
    this.projects = new ProjectStore(this.sdk.Hyperdrive, this.database);
    this.accounts = new AccountStore(
      this.sdk.Hyperdrive,
      this.database,
      this.projects
    );
    // TODO: Start peer discovery
  }

  static async create(opts) {
    const core = new NatakanuCore(opts || {});

    await core.init();

    return core;
  }
}
