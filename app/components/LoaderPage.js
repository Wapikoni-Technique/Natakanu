import React from 'react';

import Loader from './Loader';
import PageContainer from './PageContainer';

export default function LoaderPage(props) {
  return (
    <PageContainer {...props}>
      <Loader />
    </PageContainer>
  );
}
