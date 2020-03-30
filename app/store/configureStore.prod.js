// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from '../reducers';
import type { counterStateType } from '../reducers/types';
import promiseMiddleware from 'redux-promise';
import { syncTranslationWithStore} from 'react-redux-i18n';
import localizations from '../localization';

const history = createHashHistory();
const rootReducer = createRootReducer(history);
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, promiseMiddleware, router);

function configureStore(initialState?: counterStateType) {
  const store = createStore<*, counterStateType, *>(
    rootReducer,
    initialState,
    enhancer
  );

  syncTranslationWithStore(store)
  store.dispatch(loadTranslations(localizations))
  store.dispatch(setLocale(navigator.language))

  return store
}

export default { configureStore, history };
