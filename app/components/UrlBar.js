import React from 'react';
import { Formik, Form, Field } from 'formik';
import { useHistory } from 'react-router-dom';

import styles from './UrlBar.css';
import { PROTOCOL_SCHEME } from '../core/urlParser';

export default function UrlBar() {
  const history = useHistory();

  const { location, goBack, push } = history;

  const navigateTo = ({ url }) => push(url.slice(PROTOCOL_SCHEME.length - 1));
  const initialValues = {
    url: `${PROTOCOL_SCHEME}${location.pathname.slice(1)}`
  };

  return (
    <section className={styles.urlbar}>
      <button className={styles.backbutton} onClick={goBack}>
        🔙
      </button>
      <Formik onSubmit={navigateTo} initialValues={initialValues}>
        {() => (
          <Form className={styles.urlbarform}>
            <Field
              className={styles.urlbarinput}
              type="text"
              name="url"
              placholder="natakanu://"
            />
          </Form>
        )}
      </Formik>
    </section>
  );
}
