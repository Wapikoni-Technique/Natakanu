import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import getCore from '../core/get';

import NewProject from '../components/NewProject';
import AsyncPage from './AsyncPage';

export default function NewProjectContainer() {
  const { account } = useParams();
  const { push } = useHistory();

  async function onCreate(info) {
    const core = await getCore();
    const currentAccount = await core.accounts.get(account);
    await currentAccount.createProject(info);
    console.log('Navigating to account projects', account);
    push(`/account/${account}/projects/`);
  }

  return (
    <AsyncPage promiseFn={loadAccountInfo} account={account} watch={account}>
      {({ accountInfo }) => (
        <NewProject accountInfo={accountInfo} onCreate={onCreate} />
      )}
    </AsyncPage>
  );
}

async function loadAccountInfo({ account }) {
  const core = await getCore();
  const accountInstance = await core.accounts.get(account);
  const accountInfo = await accountInstance.getInfo();
  const projects = await accountInstance.getProjectsInfo();
  return {
    accountInfo,
    projects
  };
}
