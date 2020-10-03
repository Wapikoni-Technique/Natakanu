import React from 'react';
import { Formik, Form, Field } from 'formik';
import { useHistory } from 'react-router-dom';

import styles from './UrlBar.css';
import { PROTOCOL_SCHEME } from '../core/urlParser';
import Button from './Button';
import localization from '../localization';

export default function UrlBar() {
  const history = useHistory();

  const { location, goBack, push } = history;

  const navigateTo = ({ url }) => push(url.slice(PROTOCOL_SCHEME.length - 1));
  const initialValues = {
    url: `${PROTOCOL_SCHEME}${location.pathname.slice(1)}`
  };

  function goHome() {
    push('/login');
  }

  return (
    <section className={styles.urlbar}>
      <Button onClick={goBack} label={localization.urlbar_back}>
        <i className="fas fa-arrow-left" />
      </Button>
      <Button onClick={goHome} label={localization.urlbar_home}>
        <i className="fas fa-home" />
      </Button>
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
