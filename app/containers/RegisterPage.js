import React from 'react';
import { useHistory } from 'react-router-dom';

import getCore from '../core/get';

import Register from '../components/Register';

export default function RegisterPage() {
  const { push } = useHistory();

  console.log('Register page');

  async function onRegister(info) {
    const { title } = info;

    const core = await getCore();

    await core.accounts.create(title, info);

    push(`/account/${title}/projects/`);
  }

  return <Register onRegister={onRegister} />;
}
