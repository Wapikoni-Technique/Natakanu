import React from 'react';

import PageContainer from './PageContainer';

import Projects from './Projects';
import styles from './RecentProjects.css';

import localization from '../localization';

export default function RecentProjects({ recent, saved, seen }) {
  const renderRecent = recent.length ? (
    <div>
      <Projects projects={recent} />
      <p className={styles.label}>{localization.recent_recent}</p>
    </div>
  ) : null;

  const renderSaved = saved.length ? (
    <div>
      <Projects projects={saved} />
      <p className={styles.label}>{localization.recent_saved}</p>
    </div>
  ) : null;

  const renderSeen = seen.length ? (
    <div>
      <Projects projects={seen} />
      <p className={styles.label}>{localization.recent_seen}</p>
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
