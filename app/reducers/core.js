// @flow
import { CORE_LOADED, ACCOUNT_LOADED } from '../actions/core';
import type { Action } from './types';

// TODO: Document types for core loading
export default function core(state: any = {}, action: Action) {
  switch (action.type) {
    case CORE_LOADED:
      return { ...state, core: action.payload.core };
    case ACCOUNT_LOADED:
    	return {...state, ...action.payload}
    default:
      return state || {};
  }
}
