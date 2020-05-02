import React from 'react';
import { Field, Formik, Form } from 'formik';

import PageContainer from './PageContainer';
import Button from './Button';

import styles from './NewProject.css';
import localization from '../localization';

const INITIAL_VALUES = {
  title: '',
  author: '',
  nation: '',
  community: '',
  description: ''
};

export default function NewProject({ accountInfo, onCreate }) {
  const { name: author } = accountInfo;

  const initialValues = { ...INITIAL_VALUES, author };

  return (
    <PageContainer backgroundClass={styles.background}>
      <Formik onSubmit={onCreate} initialValues={initialValues}>
        {() => (
          <Form className={styles.form}>
            <div className={styles.inputs}>
              <Item
                label={localization.new_project_title}
                required
                name="title"
              />
              <Item label={localization.new_project_author} name="author" />
              <Item label={localization.new_project_nation} name="nation" />
              <Item
                label={localization.new_project_community}
                name="community"
              />
              <Item
                label={localization.new_project_credits}
                name="description"
              />
            </div>
            <div className={styles.sharecontainer}>
              <Button type="submit">{localization.new_project_share}</Button>
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
