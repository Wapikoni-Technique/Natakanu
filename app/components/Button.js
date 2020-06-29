import React from 'react';

import Link from './Link';

import styles from './Button.css';

export default function({ className = '', children, big, to, ...props }) {
  const classList = [styles.button];
  if (className) classList.push(className);
  if (big) classList.push(styles.big);
  if (to)
    return (
      <Link className={classList.join(' ')} to={to} {...props}>
        {children}
      </Link>
    );

  return (
    <button type="button" className={classList.join(' ')} {...props}>
      {children}
    </button>
  );
}
