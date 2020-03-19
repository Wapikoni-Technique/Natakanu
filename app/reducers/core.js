// @flow
import {
	CORE_LOADED,
	ACCOUNT_LOADED,
	CREATED_PROJECT,
	LOADED_PROJECT,
} from '../actions/core';
import type { Action } from './types';

// TODO: Document types for core loading
export default function core(state: any = {}, action: Action) {
  switch (action.type) {
    case CORE_LOADED:
    	return {...state, ...action.payload}
    case ACCOUNT_LOADED:
    	return {...state, ...action.payload}
    case CREATED_PROJECT:
    	return {...state, ...action.payload}
    case LOADED_PROJECT:
    	return {...state, ...action.payload}
    default:
      return state || {};
  }
}
