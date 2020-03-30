import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Field, Formik, Form } from 'formik';

import routes from '../constants/routes.json';

import PageContainer from './PageContainer';
import Button from './Button';

import styles from './NewProject.css';

type Props = {
  onFolderSelected: () => void
};

const INITIAL_VALUES = {
  title: '',
  author: '',
  nation: '',
  community: '',
  description: ''
};

const DEFAULT_INFO = {
  name: ''
};

class NewProject extends Component<Props> {
  render() {
    const {
      accountInfo = DEFAULT_INFO,
      match,
      push,
      createProject
    } = this.props;

    const onGotProjectInfo = async info => {
      const { account } = match.params;

      await createProject(account, info);
      onGoBack();
    };

    const onGoBack = () => {
      const { account } = match.params;

      push(`/account/${account}/projects/`);
    };

    const { name: author } = accountInfo;

    const initialValues = { ...INITIAL_VALUES, author };

    const headerContent = <Button onClick={onGoBack}>Cancel</Button>;

    return (
      <PageContainer
        backgroundClass={styles.background}
        headerContent={headerContent}
        {...this.props}
      >
        <Formik onSubmit={onGotProjectInfo} initialValues={initialValues}>
          {props => (
            <Form className={styles.form}>
              <div className={styles.inputs}>
                <Item label="Title" required name="title" />
                <Item label="Author" name="author" />
                <Item label="Nation" name="nation" />
                <Item label="Community" name="community" />
                <Item label="Credits" name="description" />
              </div>
              <div className={styles.sharecontainer}>
                <Button type="submit">Share</Button>
              </div>
            </Form>
          )}
        </Formik>
      </PageContainer>
    );
  }
}

function Item({ children, label, ...props }) {
  return (
    <label className={styles.label}>
      {label}
      <Field className={styles.input} {...props} />
    </label>
  );
}

export default NewProject;
