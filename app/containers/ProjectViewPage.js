import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push, goBack } from 'connected-react-router';
import * as CoreActions from '../actions/core';

import ProjectView from '../components/ProjectView';

function mapStateToProps(state) {
  return state.core;
}

function mapDispatchToProps(dispatch) {
  const actions = bindActionCreators(
    { ...CoreActions, push, goBack },
    dispatch
  );
  const {
    loadProject,
    deleteFile,
    addFilesToProjectFolderWithDialog,
    downloadFileFromProjectWithDialog
  } = actions;

  async function onDownloadFile(project, path) {
    await downloadFileFromProjectWithDialog(project, path);
  }

  async function onAddFiles(project, path) {
    await addFilesToProjectFolderWithDialog(project, path);
  }

  async function onLoadProject(project) {
    return loadProject(project);
  }

  async function onDeleteFile(project, path) {
    return deleteFile(project, path);
  }

  return {
    ...actions,
    onDownloadFile,
    onAddFiles,
    onLoadProject,
    onDeleteFile
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { match } = ownProps;
  const { params } = match;

  return { ...stateProps, ...dispatchProps, ...ownProps, ...params };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ProjectView);
