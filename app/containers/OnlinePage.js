import React from 'react';
import { useHistory } from 'react-router-dom';
import { once } from 'events';

import getCore from '../core/get';
import LoaderPage from '../components/LoaderPage';
import Online from '../components/Online';

import AsyncGeneratorPage from './AsyncGeneratorPage';

export default function OnlinePage() {
  const { push } = useHistory();

  function onGoAccount(key) {
    push(`/account/${key}/projects/`);
  }

  return (
    <AsyncGeneratorPage deps={[]}>
      {async function* renderAccountPage() {
        const core = await getCore();

        while (true) {
          yield (<LoaderPage />);

          const gossiped = await core.accounts.listGossipedInfo();

          yield (<Online gossiped={gossiped} onGoAccount={onGoAccount} />);

          await once(core.gossip, 'found');
        }
      }}
    </AsyncGeneratorPage>
  );
}
