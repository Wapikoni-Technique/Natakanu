import React from 'react';
import { Formik, Form } from 'formik';
import styles from './Register.css';

import PageContainer from './PageContainer';
import Button from './Button';
import FormItem from './FormItem';
import Box from './Box';

import localization from '../localization';
import logoSrc from '../Natakanu.svg';
import backgroundSrc from '../../resources/dimmig_skog_svartvit_display.jpg';

const BACKGROUND_STYLE = {
  backgroundImage: `url(${backgroundSrc})`
};

export default function Register({ onRegister }) {
  const initialValues = { title: '', description: '', image: '' };

  return (
    <PageContainer style={BACKGROUND_STYLE}>
      <div className={styles.row}>
        <div className={`${styles.column} ${styles.intro}`}>
          <img
            src={logoSrc}
            className={styles.title}
            alt={localization.register_title}
          />
          <p>{localization.register_intro_1}</p>
          <p>{localization.register_intro_2}</p>
        </div>
        <div className={styles.column}>
          <Box>
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
                  <Button type="submit">{localization.register_button}</Button>
                </Form>
              )}
            </Formik>
          </Box>
        </div>
      </div>
    </PageContainer>
  );
}
