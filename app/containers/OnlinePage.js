import React from 'react';
import { useHistory } from 'react-router-dom';
import { once } from 'events';

import getCore from '../core/get';
import LoaderPage from '../components/LoaderPage';
import Online from '../components/Online';

import AsyncGeneratorPage from './AsyncGeneratorPage';
import { DEFAULT_GOSSIP_KEY } from '../constants/core';

export default function OnlinePage() {
  const { push } = useHistory();

  function onGoAccount(key) {
    push(`/account/${key}/projects/`);
  }

  return (
    <AsyncGeneratorPage deps={[]}>
      {async function* renderAccountPage() {
        const core = await getCore();

        async function onUpdateGossipKey(gossipKey) {
          await core.gossip.updateKey(gossipKey || DEFAULT_GOSSIP_KEY);
        }

        while (true) {
          yield (<LoaderPage />);

          const gossiped = await core.accounts.listGossipedInfo();
          const { gossipKey } = core.gossip;

          yield (
            <Online
              gossiped={gossiped}
              onGoAccount={onGoAccount}
              onUpdateGossipKey={onUpdateGossipKey}
              gossipKey={gossipKey}
            />
          );

          await once(core.gossip, 'changed');
        }
      }}
    </AsyncGeneratorPage>
  );
}
