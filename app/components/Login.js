import React from 'react';
import { Field, Formik, Form } from 'formik';
import styles from './Login.css';

import PageContainer from './PageContainer';
import AccountIcon from './AccountIcon';
import Button from './Button';
import logoSrc from '../Natakanu.svg';
import localization from '../localization';

export default function Login({ onLogin, accountInfo = {} }) {
  const { name, image } = accountInfo;
  const initialValues = { username: name };

  return (
    <PageContainer backgroundClass={styles.container}>
      <div className={styles.row}>
        <div className={styles.column}>
          <img alt="Natakanu" className={styles.logo} src={logoSrc} />
        </div>
        <div className={styles.column}>
          <AccountIcon image={image} />
          <Formik onSubmit={onLogin} initialValues={initialValues}>
            {() => (
              <Form className={styles.userform}>
                <Field
                  className={styles.userinput}
                  name="username"
                  type="text"
                  placeholder={localization.login_username}
                />
                <div className={styles.buttonContainer}>
                  <Button type="submit" className={styles.red}>
                    {localization.login_enter}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </PageContainer>
  );
}
