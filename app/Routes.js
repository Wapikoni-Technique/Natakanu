import React from 'react';
import { Switch, Route } from 'react-router-dom';

import routes from './constants/routes.json';

import App from './containers/App';

import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';
import AccountPage from './containers/AccountPage';
import ProjectViewPage from './containers/ProjectViewPage';
import NewProjectContainer from './containers/NewProjectContainer';

// import OpenProjectContainer from './containers/OpenProjectContainer';
// import OpenLibraryContainer from './containers/OpenLibraryContainer';

export default () => (
  <App>
    <Switch>
      <Route path={routes.NEW_PROJECT} component={NewProjectContainer} />
      <Route path={routes.ACCOUNT} component={AccountPage} />
      <Route path={routes.PROJECT} component={ProjectViewPage} />
      <Route path={routes.LOGIN} component={LoginPage} />
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  </App>
);

/*
  <Route path={routes.OPEN_PROJECT} component={OpenProjectContainer} />
  <Route path={routes.OPEN_LIBRARY} component={OpenLibraryContainer} />
*/
