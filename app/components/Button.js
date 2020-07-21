import React from 'react';

import Link from './Link';

import styles from './Button.css';

export default function({
  className = '',
  label,
  children,
  big,
  flat,
  to,
  ...props
}) {
  const classList = [styles.button];
  if (!flat) classList.push(styles.styled);
  if (big) classList.push(styles.big);
  if (className) classList.push(className);

  if (to)
    return (
      <Link
        aria-label={label}
        title={label}
        className={classList.join(' ')}
        to={to}
        {...props}
      >
        {children}
      </Link>
    );

  return (
    <button
      aria-label={label}
      title={label}
      type="button"
      className={classList.join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
