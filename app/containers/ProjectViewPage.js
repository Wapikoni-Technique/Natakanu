import React from 'react';
import { useParams } from 'react-router-dom';
import { once } from 'events';

import getCore from '../core/get';
import ProjectView from '../components/ProjectView';
import AsyncGeneratorPage from './AsyncGeneratorPage';

export default function ProjectViewPage() {
  const { project } = useParams();

  async function onDownloadFile(name) {
    const core = await getCore();
    const projectInstance = await core.projects.get(project);

    return projectInstance.showSaveFile(name);
  }

  async function onAddFiles() {
    const core = await getCore();
    const projectInstance = await core.projects.get(project);

    return projectInstance.showLoadFile();
  }

  async function onDeleteFile(name) {
    const core = await getCore();
    const projectInstance = await core.projects.get(project);

    return projectInstance.deleteFile(name);
  }

  return (
    <AsyncGeneratorPage deps={[project]}>
      {async function* renderProjectViewPage() {
        const core = await getCore();
        const projectInstance = await core.projects.get(project);

        while (true) {
          const projectInfo = await projectInstance.getInfo();
          const files = await projectInstance.getFileList();

          yield (
            <ProjectView
              projectInfo={projectInfo}
              files={files}
              onDownloadFile={onDownloadFile}
              onAddFiles={onAddFiles}
              onDeleteFile={onDeleteFile}
            />
          );
          await once(projectInstance.archive, 'update');
        }
      }}
    </AsyncGeneratorPage>
  );
}
