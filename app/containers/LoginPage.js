import React from 'react';
import { useHistory } from 'react-router-dom';

import Login from '../components/Login';

const DEFAULT_ACCOUNT_INFO = {
  name: undefined,
  image: undefined
};

export default function LoginPage() {
  const { push } = useHistory();

  function onLogin({ username }) {
    console.log('Navigating to username', username);
    push(`/account/${username}/projects/`);
  }

  return <Login onLogin={onLogin} accountInfo={DEFAULT_ACCOUNT_INFO} />;
}
