import React from 'react';
import useAsyncGenerator from 'use-async-generator';

import LoaderPage from '../components/LoaderPage';
import ErrorPage from '../components/ErrorPage';

export default function AsyncGeneratorPage({ children, deps = [] }) {
  return (
    useAsyncGenerator(async function* renderGenerator() {
      try {
        return yield* children(...deps);
      } catch (error) {
        yield (<ErrorPage error={error} />);
      }
    }, deps) || <LoaderPage />
  );
}
