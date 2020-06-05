import React from 'react';

import getCore from '../core/get';

import AsyncPage from './AsyncPage';

import RecentProjects from '../components/RecentProjects';

export default function RecentProjectsPage() {
  return (
    <AsyncPage promiseFn={load}>
      {projects => <RecentProjects projects={projects} />}
    </AsyncPage>
  );
}

async function load() {
  const core = await getCore();

  const projects = await core.projects.getRecent();

  const infos = await Promise.all(projects.map(project => project.getInfo()));

  console.log({ infos });

  return infos;
}
