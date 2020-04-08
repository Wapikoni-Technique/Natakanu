// @flow
import React from 'react';
import { hot } from 'react-hot-loader/root';
import {BrowserRouter} from 'react-router-dom'

import Routes from '../Routes';


const Root = ({ store, history }: Props) => (
  <BrowserRouter>
    <Routes />
  </BrowserRouter>
);

export default hot(Root);

