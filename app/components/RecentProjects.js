import React from 'react';

import PageContainer from './PageContainer';

import Projects from './Projects';

// import localization from '../localization';

import styles from './Account.css';

export default function Account({ projects }) {
  return (
    <PageContainer backgroundClass={styles.background}>
      <Projects projects={projects} />
    </PageContainer>
  );
}
