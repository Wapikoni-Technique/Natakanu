import React, { Component } from 'react';
import styles from './PageContainer.css';
import {Formik, Form, Field} from 'formik'
import { PROTOCOL_SCHEME } from '../core/urlParser'

type Props = {
  contentClass: string,
  backgroundClass: string,
  headerContent: any,
  children: any,
  push: (string) => void,
  goBack: () => void,
};

export default class PageContainer extends Component<Props> {
  props: Props;

  render() {
    const {
      contentClass = '',
      backgroundClass = '',
      headerContent,
      children,
      push,
      goBack,
      location
    } = this.props;

    const navigateTo = ({url}) => push(url.slice(PROTOCOL_SCHEME.length - 1))
    const initialValues = {url: `${PROTOCOL_SCHEME}${location.pathname.slice(1)}`}

    return (
      <div className={`${styles.wrapper} ${backgroundClass}`}>
        <header className={styles.header}>{headerContent}</header>
        <Formik onSubmit={navigateTo} initialValues={initialValues}>{(props) => (
					<Form className={styles.urlbar}>
						<button className={styles.backbutton} onClick={goBack}>🔙</button>
						<Field className={styles.urlbarinput} type="text" name="url" placholder="natakanu://" />
					</Form>
        )}</Formik>
        <main className={`${styles.content} ${contentClass}`}>{children}</main>
      </div>
    );
  }
}
