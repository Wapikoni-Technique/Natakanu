import React from 'react';
import styles from './PageContainer.css';

import UrlBar from './UrlBar';

export default function PageContainer(props) {
  const {
    contentClass = '',
    backgroundClass = '',
    headerContent,
    children
  } = props;

  return (
    <div className={`${styles.wrapper} ${backgroundClass}`}>
      <header className={styles.header}>{headerContent}</header>
      <UrlBar />
      <main className={`${styles.content} ${contentClass}`}>{children}</main>
    </div>
  );
}
