// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import type { HashHistory } from 'history';
import { i18nReducer } from 'react-redux-i18n';
import core from './core';

export default function createRootReducer(history: HashHistory) {
  return combineReducers<{}, *>({
    router: connectRouter(history),
    core,
    i18n: i18nReducer
  });
}
