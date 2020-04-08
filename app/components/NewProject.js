import React, { Component } from 'react';
import { Field, Formik, Form } from 'formik';

import PageContainer from './PageContainer';
import Button from './Button';

import styles from './NewProject.css';

const INITIAL_VALUES = {
  title: '',
  author: '',
  nation: '',
  community: '',
  description: ''
};

export default function NewProject({accountInfo,onCreate}) {

  const { name: author } = accountInfo;

  const initialValues = { ...INITIAL_VALUES, author };

  return (
    <PageContainer
      backgroundClass={styles.background}
    >
      <Formik onSubmit={onCreate} initialValues={initialValues}>
        {() => (
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

function Item({ children, label, ...props }) {
  return (
    <label className={styles.label}>
      {label}
      <Field className={styles.input} {...props} />
    </label>
  );
}
