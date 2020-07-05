import React from 'react';
import styles from './PageContainer.css';

import UrlBar from './UrlBar';
import Button from './Button';
import { ACCOUNTS_ONLINE, RECENT_PROJECTS } from '../constants/routes.json';

export default function PageContainer({
  contentClass = '',
  backgroundClass = '',
  headerContent,
  style,
  children
}) {
  return (
    <div className={`${styles.wrapper} ${backgroundClass}`} style={style}>
      <header className={styles.header}>
        <section className={styles.headercontent}>
          <UrlBar />
          <Button to={ACCOUNTS_ONLINE}>
            <i className="fas fa-users" />
          </Button>
          <Button to={RECENT_PROJECTS}>
            <i className="fas fa-history" />
          </Button>
          {headerContent}
        </section>
      </header>
      <main className={`${styles.content} ${contentClass}`}>{children}</main>
    </div>
  );
}
