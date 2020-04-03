import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push, goBack } from 'connected-react-router';
import * as CoreActions from '../actions/core';

import Account from '../components/Account';

function mapStateToProps(state) {
	const key = state.router.location.pathname
  return {...state.core, key};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...CoreActions, push, goBack }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
