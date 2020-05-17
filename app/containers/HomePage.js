import React from 'react';
import { useHistory } from 'react-router-dom';
import Async from 'react-async';

import getCore from '../core/get';

import { LOGIN, REGISTER } from '../constants/routes.json';
import Home from '../components/Home';

export default function HomePage() {
  const { push } = useHistory();

  return (
    <Async promiseFn={load} push={push}>
      <Async.Pending>
        <Home />
      </Async.Pending>
      <Async.Rejected>{error => <div>{error.stack}</div>}</Async.Rejected>
    </Async>
  );
}

async function load({ push }) {
  const core = await getCore();

  const accountNames = await core.accounts.listNames();
  const hasAccounts = !!accountNames.length;

  if (hasAccounts) {
    push(LOGIN);
  } else {
    push(REGISTER);
  }
}
