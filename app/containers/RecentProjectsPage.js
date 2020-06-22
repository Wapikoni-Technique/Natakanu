import React from 'react';

import getCore from '../core/get';

import AsyncPage from './AsyncPage';

import RecentProjects from '../components/RecentProjects';

export default function RecentProjectsPage() {
  return (
    <AsyncPage promiseFn={load}>
      {({ recent, saved, seen }) => (
        <RecentProjects recent={recent} saved={saved} seen={seen} />
      )}
    </AsyncPage>
  );
}

async function load() {
  const core = await getCore();

  const [rawRecent, rawSaved, rawSeen] = await Promise.all([
    await core.projects.getRecent(),
    await core.projects.getSaved(),
    await core.accounts.listSeen()
  ]);

  const [recent, saved, seen] = await Promise.all([
    await Promise.all(rawRecent.map(project => project.getInfo())),
    await Promise.all(rawSaved.map(project => project.getInfo())),
    await Promise.all(rawSeen.map(account => account.getInfo()))
  ]);

  return { recent, saved, seen };
}
