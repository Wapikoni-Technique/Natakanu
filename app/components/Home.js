import React from 'react';
import styles from './Home.css';

export default function Home() {
  return (
    <div className={styles.container} data-tid="container">
      <i className="fas fa-spinner fa-pulse" />
    </div>
  );
}
