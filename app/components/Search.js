import React from 'react';

import PageContainer from './PageContainer';

import Projects from './Projects';
import SearchBar from './SearchBar';

import styles from './RecentProjects.css';

import localization from '../localization';

export default function RecentProjects({ results, search, onSearch }) {
  return (
    <PageContainer backgroundClass={styles.background}>
      <SearchBar search={search} onSearch={onSearch} />
      <div>
        <Projects projects={results} />
        <p className={styles.label}>{localization.recent_saved}</p>
      </div>
    </PageContainer>
  );
}
