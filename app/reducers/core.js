// @flow
import { CORE_LOADED } from '../actions/core';
import type { Action } from './types';

// TODO: Document types for core loading
export default function core(state: any = {}, action: Action) {
  switch (action.type) {
    case CORE_LOADED:
      return { ...state, core: action.payload.core };
    default:
      return state || {};
  }
}
