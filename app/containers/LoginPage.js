import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as CoreActions from '../actions/core';
import {push} from 'connected-react-router';

import Login from '../components/Login'

function mapStateToProps(state) {
  return state.core;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...CoreActions, push}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
