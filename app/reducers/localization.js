// @flow
import {LOCALIZATION_LANGUAGE_CHANGED} from '../actions/localization';
import type { Action } from './types';

import LocalizedStrings from 'react-localization';

import en from '../localization/en.json'

const LANGUAGE_MAP = {
	en
};

export default function counter(state, action: Action) {
	if(!state) state = new LocalizedStrings

  switch (action.type) {
    case LOCALIZATION_LANGUAGE_CHANGED:

    default
    	return state
  }
}
