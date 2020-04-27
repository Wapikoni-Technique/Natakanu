import React from 'react';
import Async from 'react-async';

import LoaderPage from '../components/LoaderPage';
import ErrorPage from '../components/ErrorPage';

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
        if (isPending) return <LoaderPage {...pageProps} />;

        if (error) return <ErrorPage error={error} {...pageProps} />;

        return children(data);
      }}
    </Async>
  );
}
