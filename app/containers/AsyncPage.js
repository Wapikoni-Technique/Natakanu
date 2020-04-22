import React from 'react';
import Async from 'react-async';

import routes from '../constants/routes.json';

import Loader from '../components/Loader';
import PageContainer from '../components/PageContainer';
import Link from '../components/Link';

export default function AsyncPage(props) {
  const {
    children,
    contentClass,
    backgroundClass,
    headerContent,
    ...asyncProps
  } = props;

  const pageProps = {
    contentClass,
    backgroundClass,
    headerContent
  };

  return (
    <Async {...asyncProps}>
      {({ data, error, isPending }) => {
        if (isPending)
          return (
            <PageContainer {...pageProps}>
              <Loader />
            </PageContainer>
          );

        if (error)
          return (
            <PageContainer {...pageProps}>
              <h1>Error:</h1>
              <p>
                <i className="fas fa-spinner fa-pulse" />
              </p>
              <p>
                <Link to={routes.HOME}>Go Back</Link>
              </p>
            </PageContainer>
          );

        return children(data);
      }}
    </Async>
  );
}
