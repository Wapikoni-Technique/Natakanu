import React from 'react';
import styles from './Login.css';

import PageContainer from './PageContainer';
import AccountIcon from './AccountIcon';
import logoSrc from '../Natakanu.svg';
import localization from '../localization';

export default function Login({ onLogin, onRegister, accounts }) {
  const accountsSections = accounts.map(({ name, image }) => (
    <button key={name} className={styles.account} onClick={() => onLogin(name)}>
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
          <button className={styles.account} onClick={onRegister}>
            ➕<div>{localization.account_add}</div>
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
