import React from 'react';

import styles from './SearchBar.css';

import localization from '../localization';

export default function RecentProjects({ search, onSearch }) {
  return (
    <div className={styles.container}>
      <input
        className={styles.searchbar}
        autoFocus
        value={search}
        onChange={e => onSearch(e.target.value)}
        placeholder={localization.recent_search}
      />
    </div>
  );
}
