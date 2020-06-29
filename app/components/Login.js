import React from 'react';
import styles from './Login.css';

import PageContainer from './PageContainer';
import AccountIcon from './AccountIcon';
import Button from './Button';

import logoSrc from '../Natakanu.svg';
import localization from '../localization';
import { REGISTER, PREFERENCES } from '../constants/routes.json';

export default function Login({ onLogin, accounts }) {
  const accountsSections = accounts.map(({ name, key, image }) => (
    <button
      type="button"
      key={key}
      className={styles.account}
      onClick={() => onLogin(key)}
    >
      <AccountIcon image={image} name={name} />
      <div>{name}</div>
    </button>
  ));

  return (
    <PageContainer backgroundClass={styles.container}>
      <div className={styles.row}>
        <div className={styles.column}>
          <img alt="Natakanu" className={styles.logo} src={logoSrc} />
        </div>
        <div className={`${styles.column} ${styles.accounts}`}>
          {accountsSections}
          <Button className={styles.account} to={REGISTER}>
            ➕<div>{localization.login_add}</div>
          </Button>
        </div>
      </div>
      <Button className={styles.preferences} to={PREFERENCES}>
        ⚙
      </Button>
    </PageContainer>
  );
}
