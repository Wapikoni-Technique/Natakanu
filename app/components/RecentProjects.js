import React from 'react';

import PageContainer from './PageContainer';

import Projects from './Projects';

// import localization from '../localization';

import styles from './Account.css';
import localization from '../localization';

export default function Account({ recent, saved, seen }) {
  const renderRecent = recent.length ? (
    <div>
      <Projects projects={recent} />
      <p>{localization.recent_recent}</p>
    </div>
  ) : null;

  const renderSaved = saved.length ? (
    <div>
      <Projects projects={saved} />
      <p>{localization.recent_saved}</p>
    </div>
  ) : null;

  const renderSeen = seen.length ? (
    <div>
      <Projects projects={seen} />
      <p>{localization.recent_seen}</p>
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
