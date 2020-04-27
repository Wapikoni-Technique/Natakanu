import React from 'react';
import { useParams } from 'react-router-dom';
import useAsyncGenerator from 'use-async-generator';
import { once } from 'events';

import getCore from '../core/get';
import ProjectView from '../components/ProjectView';
import LoaderPage from '../components/LoaderPage';
import ErrorPage from '../components/ErrorPage';

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
    useAsyncGenerator(
      async function* renderProjectViewPage() {
        yield (<LoaderPage />);
        try {
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
        } catch (error) {
          yield (<ErrorPage error={error} />);
        }
      },
      [project]
    ) || <LoaderPage />
  );
}
