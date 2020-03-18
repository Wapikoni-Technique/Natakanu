import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import NewProjectContainer from './containers/NewProjectContainer';
import OpenProjectContainer from './containers/OpenProjectContainer';
import OpenLibraryContainer from './containers/OpenLibraryContainer';
import TestPage from './containers/TestPage';
import LoginPage from './containers/LoginPage';
import AccountPage from './containers/AccountPage';

export default () => (
  <App>
    <Switch>
      <Route exact path={routes.HOME} component={HomePage} />
      <Route path={routes.NEW_PROJECT} component={NewProjectContainer} />
      <Route path={routes.OPEN_PROJECT} component={OpenProjectContainer} />
      <Route path={routes.OPEN_LIBRARY} component={OpenLibraryContainer} />
      <Route path={routes.TEST} component={TestPage} />
      <Route path={routes.LOGIN} component={LoginPage} />
      <Route path={routes.ACCOUNT} component={AccountPage} />
    </Switch>
  </App>
);
