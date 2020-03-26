import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push, goBack } from 'connected-react-router';
import * as CoreActions from '../actions/core';

import Account from '../components/Account';

function mapStateToProps(state) {
  return state.core;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...CoreActions, push, goBack }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
