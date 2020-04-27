import React from 'react';
import ColorHash from 'color-hash';

import styles from './AccountIcon.css';
import DEFAULT_IMAGE from '../Natakanu.svg';

const colorHash = new ColorHash();

export default ({ image, name }) => {
  const style = image ? null : { backgroundColor: colorHash.hex(name) };

  return (
    <img
      alt={name}
      style={style}
      className={styles.accounticon}
      src={image || DEFAULT_IMAGE}
    />
  );
};
