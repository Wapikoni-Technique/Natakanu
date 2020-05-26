import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import getCore from '../core/get';
import Account from '../components/Account';
import LoaderPage from '../components/LoaderPage';

import AsyncGeneratorPage from './AsyncGeneratorPage';

export default function AccountPage() {
  const { account } = useParams();
  const { push } = useHistory();

  function onGoCreate() {
    push(`/account/${account}/projects/new`);
  }

  return (
    <AsyncGeneratorPage deps={[account]}>
      {async function* renderAccountPage() {
        const core = await getCore();
        const accountInstance = await core.accounts.get(account);

        yield (<LoaderPage />);

        const accountInfo = await accountInstance.getInfo();
        const projects = await accountInstance.getProjectsInfo();

        yield (
          <Account
            account={account}
            accountInfo={accountInfo}
            projects={projects}
            onGoCreate={onGoCreate}
          />
        );

        // TODO: Listen on account changes
      }}
    </AsyncGeneratorPage>
  );
}
