import React from 'react';
import { Formik, Form } from 'formik';

import PageContainer from './PageContainer';
import Button from './Button';
import FormItem from './FormItem';

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
              <FormItem
                label={localization.new_project_title}
                required
                name="title"
              />
              <FormItem label={localization.new_project_author} name="author" />
              <FormItem
                name="image"
                type="file"
                label={localization.new_project_image}
              />
              <FormItem label={localization.new_project_nation} name="nation" />
              <FormItem
                label={localization.new_project_community}
                name="community"
              />
              <FormItem
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
