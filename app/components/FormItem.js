import React from 'react';
import { Field } from 'formik';
import FileField from './FileField';

import styles from './FormItem.css';

export default function Item({ children, type, label, ...props }) {
  const Component = type === 'file' ? FileField : Field;
  return (
    <label className={styles.label}>
      {label}
      <Component className={styles.input} {...props} />
      {children}
    </label>
  );
}
