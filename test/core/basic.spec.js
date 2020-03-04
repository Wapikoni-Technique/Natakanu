import SDK from 'dat-sdk';
import RAM from 'random-access-memory';
import levelup from 'levelup';
import memdown from 'memdown';
import Natakanu from '../../app/core';

describe('Basic natakanu core tests', () => {
  let db = null;
  let sdk = null;
  let natakanu = null;
  let account = null;
  let project = null;

  it('can initialize natakanu', async () => {
    sdk = await SDK({
      storage: RAM
    });
    db = levelup(memdown());
    natakanu = await Natakanu.create({ db, sdk });
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

  afterAll(cb => {
    if (sdk) sdk.destroy();
    if (db) db.close(cb);
  });
});
