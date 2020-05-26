import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './PageContainer.css';

import UrlBar from './UrlBar';
import Button from './Button';
import routes from '../constants/routes.json';
import localization from '../localization';

export default function PageContainer({
  contentClass = '',
  backgroundClass = '',
  headerContent,
  children
}) {
  const { push } = useHistory();

  return (
    <div className={`${styles.wrapper} ${backgroundClass}`}>
      <header className={styles.header}>
        <Button onClick={() => push(routes.ACCOUNTS_ONLINE)}>
          {localization.header_online}
        </Button>
        {headerContent}
      </header>
      <UrlBar />
      <main className={`${styles.content} ${contentClass}`}>{children}</main>
    </div>
  );
}
