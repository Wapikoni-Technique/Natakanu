import React from 'react';

import PageContainer from './PageContainer';

import Projects from './Projects';

// import localization from '../localization';

import styles from './Account.css';

export default function Account({ recent, saved, seen }) {
  const renderRecent = recent.length ? (
    <div>
      <Projects projects={recent} />
      <p>Projects you have recently seen</p>
    </div>
  ) : null;

  const renderSaved = saved.length ? (
    <div>
      <Projects projects={saved} />
      <p>Projects you have saved locally</p>
    </div>
  ) : null;

  const renderSeen = seen.length ? (
    <div>
      <Projects projects={seen} />
      <p>People you have seen</p>
    </div>
  ) : null;
  return (
    <PageContainer backgroundClass={styles.background}>
      {renderRecent}
      {renderSaved}
      {renderSeen}
    </PageContainer>
  );
}
