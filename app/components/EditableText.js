import React, { useState } from 'react';

import styles from './EditableText.css';

export default function EditableText({ value, onUpdate, className, children }) {
  const [isEditing, setEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);

  const onChange = e => setNewValue(e.target.value);
  const onBlur = () => {
    setEditing(false);
    onUpdate(newValue);
  };

  if (isEditing) {
    return (
      <input
        className={`${styles.input} ${className}`}
        value={newValue}
        onChange={onChange}
        onBlur={onBlur}
        autoFocus
      />
    );
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${className}`}
      onClick={() => setEditing(true)}
    >
      {value} {children}
    </button>
  );
}
