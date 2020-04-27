import React from 'react';

import PageContainer from './PageContainer';
import Link from './Link';

import routes from '../constants/routes.json';

export default function ErrorPage({ error, ...props }) {
  return (
    <PageContainer {...props}>
      <h1>Error:</h1>
      <p>{error}</p>
      <p>
        <Link to={routes.HOME}>Go Back</Link>
      </p>
    </PageContainer>
  );
}
