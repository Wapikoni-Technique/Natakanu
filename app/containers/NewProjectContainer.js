import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import * as CoreActions from '../actions/core';

import NewProject from '../components/NewProject';

function mapStateToProps(state) {
  return state.core;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...CoreActions, push }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewProject);
