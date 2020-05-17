import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { once } from 'events';
import { join } from 'path';

import getCore from '../core/get';
import ProjectView from '../components/ProjectView';
import AsyncGeneratorPage from './AsyncGeneratorPage';

export default function ProjectViewPage() {
  const { project, subpath = '/' } = useParams();
  const { push } = useHistory();

  async function onDownloadFile(name) {
    const core = await getCore();
    const projectInstance = await core.projects.get(project);

    return projectInstance.showSaveFile(name);
  }

  async function onAddFiles() {
    const core = await getCore();
    const projectInstance = await core.projects.get(project);

    return projectInstance.showLoadFile(subpath);
  }

  async function onDeleteFile(name) {
    const core = await getCore();
    const projectInstance = await core.projects.get(project);

    return projectInstance.deleteFile(join(subpath, name));
  }

  function onNavigateTo(folder) {
    push(`./${folder}/`);
  }

  console.log('Viewing project', project, subpath);

  return (
    <AsyncGeneratorPage deps={[project, subpath]}>
      {async function* renderProjectViewPage() {
        const core = await getCore();
        const projectInstance = await core.projects.get(project);

        while (true) {
          const projectInfo = await projectInstance.getInfo();
          const files = await projectInstance.getFileList(subpath || '/');

          yield (
            <ProjectView
              projectInfo={projectInfo}
              files={files}
              subpath={subpath}
              onDownloadFile={onDownloadFile}
              onAddFiles={onAddFiles}
              onDeleteFile={onDeleteFile}
              onNavigateTo={onNavigateTo}
            />
          );
          await once(projectInstance.archive, 'update');
        }
      }}
    </AsyncGeneratorPage>
  );
}
