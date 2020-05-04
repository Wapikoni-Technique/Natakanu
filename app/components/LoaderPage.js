import React from 'react';

import Loader from './Loader';
import PageContainer from './PageContainer';

import styles from './LoaderPage.css';

export default function LoaderPage(props) {
  return (
    <PageContainer
      contentClass={styles.container}
      backgroundClass={styles.background}
      {...props}
    >
      <Loader />
    </PageContainer>
  );
}
