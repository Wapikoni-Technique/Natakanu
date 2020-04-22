import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import getCore from '../core/get';

import Account from '../components/Account';
import AsyncPage from './AsyncPage';

export default function AccountPage() {
  console.log('Loading account page');
  const { account } = useParams();
  const { push } = useHistory();

  function onGoCreate() {
    push(`/account/${account}/projects/new`);
  }

  return (
    <AsyncPage promiseFn={loadAccountInfo} account={account} watch={account}>
      {({ accountInfo, projects }) => (
        <Account
          account={account}
          accountInfo={accountInfo}
          projects={projects}
          onGoCreate={onGoCreate}
        />
      )}
    </AsyncPage>
  );
}

async function loadAccountInfo({ account }) {
  console.log('Loading account', account);
  const core = await getCore();
  const accountInstance = await core.accounts.get(account);
  const accountInfo = await accountInstance.getInfo();
  const projects = await accountInstance.getProjectsInfo();

  console.log('Loaded account', projects, accountInfo);
  return {
    accountInfo,
    projects
  };
}
