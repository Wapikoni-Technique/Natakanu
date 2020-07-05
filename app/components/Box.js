import React from 'react';

import styles from './Box.css';

export default function Box({ className, children }) {
  return (
    <section className={`${styles.box} ${className || ''}`}>{children}</section>
  );
}
