import SDK from 'dat-sdk';
import envPaths from 'env-paths';
import levelup from 'levelup';
import EventEmitter from 'events';
import path from 'path';

import { APPLICATION_NAME } from './constants';

import Database from './Database';
import ProjectStore from './ProjectStore';
import AccountStore from './AccountStore';

export default class NatakanuCore extends EventEmitter {
  constructor({ applicationName = APPLICATION_NAME, db, sdk }) {
    super();
    this.sdk = sdk;
    this.db = db;
    this.applicationName = applicationName;
  }

  async init() {
    const { applicationName } = this;
    const dataPath = envPaths(applicationName).data;
    if (!this.db)
      this.db = levelup(path.join(dataPath, 'levelup'), {
        valueEncoding: 'json'
      });
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
    const core = new NatakanuCore(opts);

    await core.init();

    return core;
  }
}
