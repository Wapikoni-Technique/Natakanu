// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Field, Formik, Form } from 'formik';
import styles from './Login.css';
import routes from '../constants/routes.json';

import PageContainer from './PageContainer';
import AccountIcon from './AccountIcon';
import Button from './Button';
import logoSrc from '../Natakanu.svg';

type Props = {
  accountInfo: {
    name: string,
    description: string,
    image: string
  },
  loadAccount: (username: string) => void
};

export default class Login extends Component<Props> {
  props: Props;

  render() {
    const { accountInfo = {}, push } = this.props;
    const { name, image } = accountInfo;
    const initialValues = { username: name };
    const onLogin = ({ username }) => {
      push(`/account/${username}/projects/`);
    };

    return (
      <PageContainer backgroundClass={styles.container} {...this.props}>
        <div className={styles.row}>
          <div className={styles.column}>
            <img className={styles.logo} src={logoSrc} />
          </div>
          <div className={styles.column}>
            <AccountIcon image={image} />
            <Formik onSubmit={onLogin} initialValues={initialValues}>
              {({ props }) => (
                <Form className={styles.userform}>
                  <Field
                    className={styles.userinput}
                    name="username"
                    type="text"
                    placeholder="Enter Username"
                  />
                  <div className={styles.buttonContainer}>
                    <Button type="submit" className={styles.red}>
                      enter
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
}
