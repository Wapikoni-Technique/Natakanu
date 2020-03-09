import { createAction } from 'redux-actions';
import { remote } from 'electron';

export const CORE_LOADED = 'CORE_LOADED';

export const loadCore = createAction(CORE_LOADED, async () => {
  const core = await remote.getGlobal('loadCore')();
  return {
    core
  };
});
