import React from 'react';
import styles from './AccountIcon.css';

export default ({ image }) => {
  return <img className={styles.accounticon} src={image} />;
};
