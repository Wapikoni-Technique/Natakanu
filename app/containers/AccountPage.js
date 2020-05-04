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

  function onGoAccount(key) {
    push(`/account/${key}/projects/`);
  }

  return (
    <AsyncGeneratorPage deps={[account]}>
      {async function* renderAccountPage() {
        const core = await getCore();
        const accountInstance = await core.accounts.get(account);

        while (true) {
          yield (<LoaderPage />);

          const accountInfo = await accountInstance.getInfo();
          const projects = await accountInstance.getProjectsInfo();
          const gossiped = await core.accounts.listGossipedInfo();
          const filtered = gossiped.filter(({ key }) => {
            return key !== account;
          });

          console.log({ projects });

          yield (
            <Account
              gossiped={filtered}
              account={account}
              accountInfo={accountInfo}
              projects={projects}
              onGoCreate={onGoCreate}
              onGoAccount={onGoAccount}
            />
          );

          await once(core.gossip, 'found');
        }
      }}
    </AsyncGeneratorPage>
  );
}
