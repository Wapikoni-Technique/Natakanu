import React from 'react';
import styles from './Login.css';

import PageContainer from './PageContainer';
import AccountIcon from './AccountIcon';
import Button from './Button';

import logoSrc from '../Natakanu.svg';
import { REGISTER, PREFERENCES } from '../constants/routes.json';
import backgroundSrc from '../../resources/dimmig_skog_svartvit_display.jpg';

const BACKGROUND_STYLE = {
  backgroundImage: `url(${backgroundSrc})`
};

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

  const headerContent = (
    <>
      <Button to={REGISTER}>
        <i className="fas fa-user-plus" />
      </Button>
      <Button className={styles.preferences} to={PREFERENCES}>
        <i className="fas fa-cogs" />
      </Button>
    </>
  );

  return (
    <PageContainer style={BACKGROUND_STYLE} headerContent={headerContent}>
      <div className={styles.row}>
        <div className={styles.column}>
          <img alt="Natakanu" className={styles.logo} src={logoSrc} />
        </div>
        <div className={`${styles.column} ${styles.accounts}`}>
          {accountsSections}
        </div>
      </div>
    </PageContainer>
  );
}
