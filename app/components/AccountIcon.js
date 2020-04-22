import React from 'react';
import styles from './AccountIcon.css';

import DEFAULT_IMAGE from '../Natakanu.svg';

export default ({ image, name }) => {
  return (
    <img
      alt={name}
      className={styles.accounticon}
      src={image || DEFAULT_IMAGE}
    />
  );
};
