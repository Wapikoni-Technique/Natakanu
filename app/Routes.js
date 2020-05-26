import React from 'react';
import { Switch, Route } from 'react-router-dom';

import routes from './constants/routes.json';

import App from './containers/App';

import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';
import AccountPage from './containers/AccountPage';
import ProjectViewPage from './containers/ProjectViewPage';
import NewProjectContainer from './containers/NewProjectContainer';
import RegisterPage from './containers/RegisterPage';
import OnlinePage from './containers/OnlinePage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.NEW_PROJECT} component={NewProjectContainer} />
      <Route path={routes.ACCOUNTS_ONLINE} component={OnlinePage} />
      <Route path={routes.ACCOUNT} component={AccountPage} />
      <Route path={routes.PROJECT} component={ProjectViewPage} />
      <Route path={routes.LOGIN} component={LoginPage} />
      <Route path={routes.REGISTER} component={RegisterPage} />
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  </App>
);
