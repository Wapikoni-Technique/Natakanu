// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import type { HashHistory } from 'history';
import core from './core';
import { i18nReducer } from 'react-redux-i18n';

export default function createRootReducer(history: HashHistory) {
  return combineReducers<{}, *>({
    router: connectRouter(history),
    core,
    i18n: i18nReducer
  });
}
