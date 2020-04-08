import React, { Component } from 'react';
import Link from './Link';

import PageContainer from './PageContainer';
import AccountIcon from './AccountIcon';
import Button from './Button';

import styles from './Account.css';

export default function Account({accountInfo, projects, onGoCreate}) {
  const { name, image, key } = accountInfo;

  const headerContent = <Button onClick={onGoCreate}>New Project</Button>;

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
          <Link
            className={styles.project}
            to={`${url}view/`}
            key={projectKey}
          >
            {title}
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
