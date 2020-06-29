const CHANGE_EVENT = 'changed:superpeer';

export default class SuperPeer {
  constructor(accounts, gossip, preferences) {
    this.accounts = accounts;
    this.gossip = gossip;
    this.preferences = preferences;

    this.enabled = false;

    this.crawlAndSave = this.crawlAndSave.bind(this);
    this.reactEnabled = this.reactEnabled.bind(this);
  }

  async init() {
    // Get preference from DB
    const enabled = await this.preferences.getSuperPeer();

    this.gossip.on('changed', this.crawlAndSave);
    this.preferences.on(CHANGE_EVENT, this.reactEnabled);

    if (enabled) this.enable();
  }

  async setEnabled(enabled) {
    await this.preferences.setSuperPeer(enabled);
  }

  async reactEnabled(enabled) {
    if (enabled) await this.enable();
    else await this.disable();
  }

  async enable() {
    if (this.enabled) return;
    console.log('Enabling super peer mode');

    this.enabled = true;

    this.crawlAndSave();
  }

  async disable() {
    if (!this.enabled) return;

    console.log('Disabling super peer mode');

    this.enabled = false;
  }

  async crawlAndSave() {
    if (!this.enabled) return;

    const ids = await this.gossip.list();

    for (const id of ids) {
      process.nextTick(async () => {
        const account = await this.accounts.get(id.toString('hex'));

        if (account.writable) return;

        const projects = await account.getProjects();

        for (const project of projects) {
          process.nextTick(async () => {
            if (await project.isSaved()) return;
            console.log('Super peer saving', project.url);
            await project.setSaved(true);
          });
        }
      });
    }
  }
}
