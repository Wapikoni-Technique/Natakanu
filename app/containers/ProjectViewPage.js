import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { once } from 'events';
import { join } from 'path';

import getCore from '../core/get';
import ProjectView from '../components/ProjectView';
import AsyncGeneratorPage from './AsyncGeneratorPage';

import LoaderPage from '../components/LoaderPage';

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

  return (
    <AsyncGeneratorPage deps={[project, subpath]}>
      {async function* renderProjectViewPage() {
        const core = await getCore();
        const projectInstance = await core.projects.get(project);

        core.projects.addRecent(project);

        async function onSetSaved(saved) {
          await projectInstance.setSaved(saved);
        }

        async function onUpdateInfo(name, value) {
          await projectInstance.updateInfo({ [name]: value });
        }

        async function onUpdateImage(image) {
          await projectInstance.updateImage(image);
        }

        async function onDestroyProject() {
          const destroyed = await projectInstance.destroy();

          if (destroyed) push('/');
        }

        while (true) {
          yield (<LoaderPage />);

          if (projectInstance.closed)
            throw new Error('Project has been closed');

          const projectInfo = await projectInstance.getInfo();
          const files = await projectInstance.getFileList(subpath || '/');
          const numPeers = projectInstance.peers.length;

          yield (
            <ProjectView
              projectInfo={projectInfo}
              files={files}
              subpath={subpath}
              numPeers={numPeers}
              onDownloadFile={onDownloadFile}
              onAddFiles={onAddFiles}
              onDeleteFile={onDeleteFile}
              onNavigateTo={onNavigateTo}
              onSetSaved={onSetSaved}
              onUpdateInfo={onUpdateInfo}
              onUpdateImage={onUpdateImage}
              onDestroyProject={onDestroyProject}
            />
          );

          await once(projectInstance, 'update');
          console.log('Project updated');
        }
      }}
    </AsyncGeneratorPage>
  );
}
