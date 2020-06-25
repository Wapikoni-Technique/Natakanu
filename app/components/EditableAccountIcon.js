import React from 'react';
import AccountIcon from './AccountIcon';

import styles from './EditableAccountIcon.css';

export default function EditableAccountIcon({ image, name, onChange }) {
  function onFileChange({ target }) {
    const { files } = target;

    if (!files.length) return;

    const file = files[0];

    onChange(file.path);
  }

  return (
    <label>
      <input
        type="file"
        className={styles.hiddenInput}
        onChange={onFileChange}
      />
      <AccountIcon image={image} name={name} />
    </label>
  );
}
