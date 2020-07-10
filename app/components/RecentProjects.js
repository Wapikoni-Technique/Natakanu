import React from 'react';

import PageContainer from './PageContainer';

import Projects from './Projects';
import AccountIcon from './AccountIcon';
import Link from './Link';

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
      <div className={styles.people}>
        {seen.map(({ key, ...person }) => (
          <Person key={key} {...person} />
        ))}
      </div>
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

function Person({ image, name, url }) {
  return (
    <Link to={`${url}projects`} className={styles.person}>
      <AccountIcon name={name} image={image} />
      <span>{name}</span>
    </Link>
  );
}
