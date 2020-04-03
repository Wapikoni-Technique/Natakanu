// @flow
import React, { Component } from 'react';
import routes from '../constants/routes.json';
import styles from './Home.css';

type Props = {
  push: (url: string) => void
};

export default class Home extends Component<Props> {
  props: Props;

  componentDidMount() {
    const { push, loadCore } = this.props;

    return loadCore().then(() => {
      return push(routes.LOGIN);
    });
  }

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <i className="fas fa-spinner fa-pulse" />
      </div>
    );
  }
}
