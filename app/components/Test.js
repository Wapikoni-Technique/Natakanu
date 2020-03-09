// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './Home.css';

type Props = {
  loadCore: () => void,
  core: any
};

export default class Test extends Component<Props> {
  props: Props;

  componentDidMount() {
    const { loadCore } = this.props;
    loadCore();
  }

  render() {
    const { core } = this.props;

    window.core = core;

    return (
      <div className={styles.container} data-tid="container">
        <h2>Test Page</h2>
        <p>Open the console to check if it loaded</p>
        <Link to={routes.HOME}>Home</Link>
      </div>
    );
  }
}
