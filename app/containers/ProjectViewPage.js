import React from 'react';
import { useParams } from 'react-router-dom';
import getCore from '../core/get';

import ProjectView from '../components/ProjectView';
import AsyncPage from './AsyncPage';

export default function ProjectViewPage() {
  const { project } = useParams();

  async function onDownloadFile(name) {
    const core = await getCore();
    const projectInstance = await core.projects.get(project);

    return projectInstance.showSaveFIle(name);
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
    <AsyncPage promiseFn={loadProjectInfo} project={project} watch={project}>
      {({ projectInfo, files }) => (
        <ProjectView
          projectInfo={projectInfo}
          files={files}
          onDownloadFile={onDownloadFile}
          onAddFiles={onAddFiles}
          onDeleteFile={onDeleteFile}
        />
      )}
    </AsyncPage>
  );
}

async function loadProjectInfo({ project, path }) {
  const core = await getCore();
  const projectInstance = await core.projects.get(project);
  const projectInfo = await projectInstance.getInfo();
  const files = await projectInstance.getFileList(path);

  return {
    projectInfo,
    files
  };
}
