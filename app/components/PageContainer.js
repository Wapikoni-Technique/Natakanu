import React from 'react';
import styles from './PageContainer.css';

import UrlBar from './UrlBar';
import Button from './Button';
import { ACCOUNTS_ONLINE, RECENT_PROJECTS } from '../constants/routes.json';
import localization from '../localization';

export default function PageContainer({
  contentClass = '',
  backgroundClass = '',
  headerContent,
  children
}) {
  return (
    <div className={`${styles.wrapper} ${backgroundClass}`}>
      <header className={styles.header}>
        <Button to={ACCOUNTS_ONLINE}>{localization.header_online}</Button>
        <Button to={RECENT_PROJECTS}>
          {localization.header_recent_projects}
        </Button>
        {headerContent}
      </header>
      <UrlBar />
      <main className={`${styles.content} ${contentClass}`}>{children}</main>
    </div>
  );
}
