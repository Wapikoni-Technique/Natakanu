import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Test from '../components/Test';
import * as CoreActions from '../actions/core';

function mapStateToProps(state) {
  return state.core;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CoreActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);
