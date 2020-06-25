import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { once } from 'events';

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

        async function onUpdateName(name) {
          await accountInstance.updateInfo({ name });
        }

        async function onUpdateImage(filePath) {
          await accountInstance.updateImage(filePath);
        }

        while (true) {
          yield (<LoaderPage />);

          const accountInfo = await accountInstance.getInfo();
          const projects = await accountInstance.getProjectsInfo();
          const numPeers = accountInstance.peers.length;

          yield (
            <Account
              account={account}
              accountInfo={accountInfo}
              projects={projects}
              numPeers={numPeers}
              onGoCreate={onGoCreate}
              onUpdateName={onUpdateName}
              onUpdateImage={onUpdateImage}
            />
          );

          await once(accountInstance, 'update');
        }
      }}
    </AsyncGeneratorPage>
  );
}
