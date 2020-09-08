import SDK from 'dat-sdk';
import RAM from 'random-access-memory';
import levelup from 'levelup';
import encodingdown from 'encoding-down';
import memdown from 'memdown';
import delay from 'delay';

import Natakanu from '../../app/core';

const gossipKey = `Natakanu Test ${Math.random()}`;

describe('Basic natakanu core tests', () => {
  let natakanu = null;
  let account = null;
  let project = null;
  let natakanu2 = null;
  let project2 = null;

  it('can initialize natakanu', async () => {
    const sdk = await SDK({
      storage: RAM
    });
    const db = levelup(
      encodingdown(memdown(), {
        valueEncoding: 'json'
      })
    );
    natakanu = await Natakanu.create({ db, sdk, gossipKey });
  });
  it('can create an account', async () => {
    const name = 'Test User';
    account = await natakanu.accounts.create(name, {});
  });
  it('Project listing when empty', async () => {
    const projects = await account.getProjects();

    expect(projects.length).toBe(0);
  });
  it('Able to create projects', async () => {
    project = await account.createProject({
      title: 'Test Project'
    });

    expect(project.writable).toBe(true);
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

    // Wait a bit for replication to happen
    await delay(2000);

    const existing = natakanu2.gossip.list();

    expect(existing.length).toBe(1);
  });
  it('Can track recently seen archives', async () => {
    await natakanu.projects.addRecent(project.url);

    const recent = await natakanu.projects.getRecentNames();

    expect(recent.length).toBe(1);
    expect(recent[0]).toBe(project.url);
  });
  it('Can search for recently seen archives', async () => {
    for await (const { url } of natakanu.search('Test')) {
      expect(url).toBe(project.url);
    }
  });
  it('Can request authorization to write to an archive and be denied', async () => {
    project2 = await natakanu2.projects.get(project.url);

    await expect(project2.requestWrite()).rejects.toThrow(
      'Authorization Denied'
    );
  });
  it('Can request authorization to write to an archive and be granted', async () => {
    await project.setWriterAuthStrategy('allow');

    await project2.requestWrite();

    await project2.archive.writeFile('/example2.txt', 'Hello Universe');

    const contents = await project2.archive.readFile('/example2.txt', 'utf8');

    expect(contents).toBe('Hello Universe');

    const otherConents = await project.archive.readFile(
      '/example2.txt',
      'utf8'
    );

    expect(otherConents).toBe('Hello Universe');
  });

  afterAll(async () => {
    if (natakanu) await natakanu.close();
    if (natakanu2) await natakanu2.close();
  });
});
