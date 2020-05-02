import React from 'react';
import ColorHash from 'color-hash';

import Link from './Link';
import PageContainer from './PageContainer';
import AccountIcon from './AccountIcon';
import Button from './Button';

import localization from '../localization';

import styles from './Account.css';

const colorHash = new ColorHash();

export default function Account({
  accountInfo,
  projects,
  gossiped,
  onGoCreate,
  onGoAccount
}) {
  const { name, image } = accountInfo;

  const gossipedAccounts = gossiped.map(({ key, name: foundName }) => (
    <Button
      key={key}
      onClick={() => onGoAccount(key)}
      style={{ background: colorHash.hex(key) }}
    >
      {foundName}
    </Button>
  ));
  const newProjectButton = (
    <Button onClick={onGoCreate}>{localization.account_new_project}</Button>
  );
  const headerContent = (
    <div>
      {newProjectButton}
      {gossipedAccounts}
    </div>
  );

  return (
    <PageContainer
      backgroundClass={styles.background}
      headerContent={headerContent}
    >
      <div className={styles.accountInfo}>
        <AccountIcon image={image} name={name} />
        <div className={styles.accountName}>{name}</div>
      </div>
      <div className={styles.projects}>
        {projects.map(({ key: projectKey, url, title }) => (
          <Link className={styles.project} to={`${url}view/`} key={projectKey}>
            {title}
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
