import React from 'react';
import { Provider } from 'react-redux';
import { hydrate } from 'react-dom';
import Loadable from 'react-loadable';
import store from './store';
import Router from './router';
import './styles/index.scss';

const render = () => {
  hydrate(
    <Provider store={store}>
      <Router />
    </Provider>,
    document.querySelector('#root'),
  );
};

Loadable.preloadReady().then(render);
