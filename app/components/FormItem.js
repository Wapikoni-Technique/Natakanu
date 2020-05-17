import React from 'react';
import { Field } from 'formik';

import styles from './FormItem.css';

export default function Item({ children, label, ...props }) {
  return (
    <label className={styles.label}>
      {label}
      <Field className={styles.input} {...props} />
      {children}
    </label>
  );
}
