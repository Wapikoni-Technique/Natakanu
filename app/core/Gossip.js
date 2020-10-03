import EventEmitter from 'events';
import datGossip from 'dat-gossip';
import hasha from 'hasha';

export default class Gossip extends EventEmitter {
  constructor(id, Hypercore, database, gossipKey) {
    super();
    this.id = id;
    this.Hypercore = Hypercore;
    this.database = database;
    this.gossipKey = gossipKey;
    this.keys = new Set();
    console.log({ id, Hypercore, database, gossipKey });
  }

  async init() {
    console.log('Loading gossip key');
    if (!this.gossipKey) this.gossipKey = await this.database.getGossipKey();
    console.log('Loaded key', this.gossipKey);
    await this.loadGossip();
  }

  async loadGossip() {
    console.log('Loading gossip', this.gossipKey);
    const gossipCoreKey = hasha(this.gossipKey).slice(0, 64);
    console.log('Gossip core key', gossipCoreKey);
    this.gossipCore = this.Hypercore(gossipCoreKey);

    console.log('Gossip Core', this.gossipKey, gossipCoreKey.length);

    await this.gossipCore.ready();

    this.gossip = datGossip(this.gossipCore, {
      id: this.id
    });

    this.gossip.on('changed', () => this.emit('changed'));

    for (const key of this.keys) {
      await this.advertise(key);
    }
  }

  async unloadGossip() {
    await this.gossipCore.close();
  }

  async updateKey(gossipKey) {
    await this.database.setGossipKey(gossipKey);

    await this.unloadGossip();

    this.gossipKey = gossipKey;

    await this.loadGossip();

    this.emit('changed');
  }

  advertise(key) {
    console.log('Advertising', key);
    this.gossip.advertise(key);
    this.keys.add(key.toString('hex'));
  }

  delete(key) {
    console.log('Unadvertising', key);
    this.gossip.delete(key);
    this.keys.delete(key.toString('hex'));
  }

  list() {
    return this.gossip.list();
  }
}
