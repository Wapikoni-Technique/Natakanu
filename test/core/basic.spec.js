import SDK from 'dat-sdk';
import RAM from 'random-access-memory';
import levelup from 'levelup';
import memdown from 'memdown';
import { once } from 'events';

import Natakanu from '../../app/core';

const gossipKey = `Natakanu Test ${Math.random()}`;

describe('Basic natakanu core tests', () => {
  let natakanu = null;
  let account = null;
  let project = null;
  let natakanu2 = null;

  it('can initialize natakanu', async () => {
    const sdk = await SDK({
      storage: RAM
    });
    const db = levelup(memdown());
    natakanu = await Natakanu.create({ db, sdk, gossipKey });
  });
  it('can create an account', async () => {
    account = await natakanu.accounts.create({
      name: 'Test User'
    });
  });
  it('Project listing when empty', async () => {
    const projects = await account.getProjects();

    expect(projects.length).toBe(0);
  });
  it('Able to create projects', async () => {
    project = await account.createProject({
      name: 'Test Project'
    });
  });
  it('Able to write to created project', async () => {
    await project.archive.writeFile('example.txt', 'Hello world!');
  });
  it('Project listing with existing projects', async () => {
    const projects = await account.getProjects();
    expect(projects.length).toBe(1);
    expect(projects[0]).toBe(project);
  });
  it('Can gossip archives over the network', async () => {
    const sdk = await SDK({
      storage: RAM
    });
    const db = levelup(memdown());

    natakanu2 = await Natakanu.create({ db, sdk, gossipKey });

    const existing = natakanu2.gossip.list();

    // Must have already gotten the advertisement
    if (existing.length) expect(existing.length).toBe(1);
    else {
      // Must be the archive, woot!
      const data = await once(natakanu2.gossip, 'found');
      expect(data).toBeTruthy();
    }
  });

  afterAll(async () => {
    if (natakanu) await natakanu.close();
    if (natakanu2) await natakanu2.close();
  });
});
