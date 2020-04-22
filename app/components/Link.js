import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { PROTOCOL_SCHEME } from '../core/urlParser';

const HAS_PROTOCOL = /^[^:]+:/;

export default function Link({ to = '', children, ...props }) {
  let href = to;
  if (to.startsWith(PROTOCOL_SCHEME)) {
    href = to.slice(PROTOCOL_SCHEME.length - 1);
  }

  if (href.match(HAS_PROTOCOL))
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );

  return (
    <RouterLink to={href} {...props}>
      {children}
    </RouterLink>
  );
}
