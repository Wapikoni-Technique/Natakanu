import React from 'react';

import PageContainer from './PageContainer';
import Link from './Link';

import routes from '../constants/routes.json';
import localization from '../localization';

export default function ErrorPage({ error, ...props }) {
  return (
    <PageContainer {...props}>
      <h1>{localization.error_page_error}</h1>
      <p>{error.stack || error.message || error}</p>
      <p>
        <Link to={routes.HOME}>{localization.error_page_go_back}</Link>
      </p>
    </PageContainer>
  );
}
