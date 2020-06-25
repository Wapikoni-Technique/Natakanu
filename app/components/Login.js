import React from 'react';
import styles from './Login.css';

import PageContainer from './PageContainer';
import AccountIcon from './AccountIcon';
import Button from './Button';

import logoSrc from '../Natakanu.svg';
import localization from '../localization';
import { RECENT_PROJECTS } from '../constants/routes.json';

export default function Login({ onLogin, onRegister, accounts }) {
  const accountsSections = accounts.map(({ name, key, image }) => (
    <button key={key} className={styles.account} onClick={() => onLogin(key)}>
      <AccountIcon image={image} name={name} />
      <div>{name}</div>
    </button>
  ));

  const recentProjectsButton = (
    <Button to={RECENT_PROJECTS}>{localization.login_recent_projects}</Button>
  );

  return (
    <PageContainer
      backgroundClass={styles.container}
      headerContent={recentProjectsButton}
    >
      <div className={styles.row}>
        <div className={styles.column}>
          <img alt="Natakanu" className={styles.logo} src={logoSrc} />
        </div>
        <div className={`${styles.column} ${styles.accounts}`}>
          {accountsSections}
          <button className={styles.account} onClick={onRegister}>
            ➕<div>{localization.account_add}</div>
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
