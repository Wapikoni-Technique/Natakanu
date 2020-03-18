import { createAction } from 'redux-actions';
import { remote } from 'electron';

export const CORE_LOADED = 'CORE_LOADED';
export const ACCOUNT_LOADED = 'ACCOUNT_LOADED';

const getCore = () => remote.getGlobal('loadCore')();

export const loadCore = createAction(CORE_LOADED, async () => {
  const core = await getCore();
  return {
    core
  };
});

export const loadAccount = createAction(ACCOUNT_LOADED, async (username) => {
	const core = await getCore()
	const account = await core.accounts.get(username)
	const accountInfo = await account.getInfo()
	const projects = await account.getProjectsInfo()

	return {
		account,
		accountInfo,
		projects
	};
})
