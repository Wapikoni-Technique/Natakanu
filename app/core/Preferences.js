import EventEmitter from 'events';

const SUPER_PEER_KEY = 'superpeer';

export default class Preferences extends EventEmitter {
  constructor(db) {
    super();

    this.db = db;
  }

  async getSuperPeer() {
    return this.db.getPreference(SUPER_PEER_KEY, false);
  }

  async setSuperPeer(enabled) {
    await this.setPreference(SUPER_PEER_KEY, enabled);
  }

  async setPreference(name, value) {
    this.db.updatePreference(name, value);
    this.emit('changed', name, value);
    this.emit(`changed:${name}`, value);
  }
}
