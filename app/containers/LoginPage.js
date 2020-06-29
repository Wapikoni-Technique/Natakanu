import React from 'react';
import { useHistory } from 'react-router-dom';

import getCore from '../core/get';

import AsyncPage from './AsyncPage';

import Login from '../components/Login';

export default function LoginPage() {
  const { push } = useHistory();

  function onLogin(username) {
    console.log('Navigating to username', username);
    push(`/account/${username}/projects/`);
  }

  return (
    <AsyncPage promiseFn={load}>
      {accounts => <Login onLogin={onLogin} accounts={accounts} />}
    </AsyncPage>
  );
}

async function load() {
  const core = await getCore();
  const accounts = await core.accounts.list();

  const infos = await Promise.all(accounts.map(account => account.getInfo()));

  console.log({ infos });

  return infos;
}
