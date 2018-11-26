import { applyMiddleware, createStore, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import rootReducer from './reducers';

/* eslint no-underscore-dangle: 0 */
let initialState = {};
let composeEnhancers = compose;
if (typeof window !== 'undefined') {
  initialState = '__INITIAL_STATE__' in window
    ? window.__INITIAL_STATE__
    : {};

  if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }
}

export default function initStore() {
  const store = createStore(rootReducer, initialState, composeEnhancers(
    applyMiddleware(reduxThunk),
  ));

  if (typeof window !== 'undefined') {
    if (process.env.NODE_ENV !== 'production') {
      window.store = store;
    }

    // initState(store); is a Promise to handle the SEO
  }

  return store;
}
