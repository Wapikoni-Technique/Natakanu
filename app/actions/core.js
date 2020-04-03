import { createAction } from 'redux-actions';
import { remote } from 'electron';

export const CORE_LOADED = 'CORE_LOADED';
export const ACCOUNT_LOADED = 'ACCOUNT_LOADED';
export const CREATED_PROJECT = 'CREATED_PROJECT';
export const LOADED_PROJECT = 'LOADED_PROJECT';
export const ADDED_FILE = 'ADDED_FILE';
export const DONWLOADED_FILE = 'DOWNLOADED_FILE';
export const DELETED_FILE = 'DELETED_FILE';

const getCore = () => remote.getGlobal('loadCore')();

export const loadCore = createAction(CORE_LOADED, async () => {
  const core = await getCore();
  return {
    core
  };
});

export const loadAccount = createAction(ACCOUNT_LOADED, async username => {
  const core = await getCore();
  const account = await core.accounts.get(username);
  const accountInfo = await account.getInfo();
  const projects = await account.getProjectsInfo();

  return {
    account,
    accountInfo,
    projects
  };
});

export const createProject = createAction(
  CREATED_PROJECT,
  async (username, info) => {
    const core = await getCore();
    const account = await core.accounts.get(username);
    const project = await account.createProject(info);
    const projectInfo = await project.getInfo();

    return {
      project,
      projectInfo
    };
  }
);

export const loadProject = createAction(
  LOADED_PROJECT,
  async (key, path = '/') => {
    const core = await getCore();
    const project = await core.projects.get(key);
    const projectInfo = await project.getInfo();
    const files = await project.getFileList(path);

    return {
      project,
      projectInfo,
      files
    };
  }
);

export const addFilesToProjectFolderWithDialog = createAction(
  ADDED_FILE,
  async (projectKey, path) => {
    const core = await getCore();
    const project = await core.projects.get(projectKey);
    const { filePaths } = await project.showLoadFile(path);
    const files = await project.getFileList(path);

    return {
      filePaths,
      files
    };
  }
);

export const downloadFileFromProjectWithDialog = createAction(
  DONWLOADED_FILE,
  async (projectKey, path) => {
    const core = await getCore();
    const project = await core.projects.get(projectKey);

    const { filePath } = await project.showSaveFile(path);

    return { filePath };
  }
);

export const deleteFile = createAction(
  DELETED_FILE,
  async (projectKey, path) => {
    const core = await getCore();
    const project = await core.projects.get(projectKey);

    await project.deleteFile(path);

    const files = await project.getFileList('/');

    return { files };
  }
);
