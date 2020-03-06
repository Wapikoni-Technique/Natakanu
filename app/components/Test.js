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
        <h2>Home</h2>
        <Link to={routes.COUNTER}>to Counter</Link>
      </div>
    );
  }
}
