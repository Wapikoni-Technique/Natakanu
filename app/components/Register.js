import React from 'react';
import { Formik, Form } from 'formik';
import styles from './Register.css';

import PageContainer from './PageContainer';
import Button from './Button';
import FormItem from './FormItem';
import localization from '../localization';

export default function Register({ onRegister }) {
  const initialValues = { title: '', description: '', image: '' };

  return (
    <PageContainer backgroundClass={styles.container}>
      <div className={styles.row}>
        <div className={styles.column}>
          <h2 className={styles.title}>{localization.register_title}</h2>
          <p>{localization.register_intro_1}</p>
          <p>{localization.register_intro_2}</p>
        </div>
        <div className={styles.column}>
          <Formik onSubmit={onRegister} initialValues={initialValues}>
            {() => (
              <Form className={styles.userform}>
                <FormItem name="title" label={localization.register_name} />
                <FormItem
                  name="image"
                  type="file"
                  label={localization.register_image}
                />
                <FormItem
                  name="description"
                  label={localization.register_about}
                />
                <div className={styles.buttonContainer}>
                  <Button type="submit" className={styles.red}>
                    {localization.register_button}
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
