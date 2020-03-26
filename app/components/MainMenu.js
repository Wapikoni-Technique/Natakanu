/* eslint-disable no-useless-constructor */
import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';

import Login from './Login';

class MainMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const defaultAccount = {
      name: 'Username',
      description: 'Example User'
    };

    return <Login accountInfo={defaultAccount} />;
    /**
    return (
      <header className="App-header">
        <p>
          <Link to={routes.TEST}>Test Loading Core</Link>
        </p>
        <p>
          <Link to={routes.NEW_PROJECT}>Nouveau projet</Link>
        </p>
        <p>
          <Link to={routes.OPEN_PROJECT}>Ouvrir mes projets</Link>
        </p>
        <p>
          <Link to={routes.OPEN_LIBRARY}>Bibliothèque</Link>
        </p>
      </header>
    );
    * */
  }
}

export default MainMenu;
