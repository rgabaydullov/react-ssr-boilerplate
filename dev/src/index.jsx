import React from 'react';
import { Provider } from 'react-redux';
import { hydrate } from 'react-dom';
import Loadable from 'react-loadable';
import store from './store';
import Router from './router';
// assets
// import './styles/normalize.css';
// import './styles/ungrid.css';
import './styles/index.scss';

window.onload = () => {
  const root = document.getElementById('root');
  root.style.display = 'block';
};

Loadable.preloadReady().then(() => {
  hydrate(
    <Provider store={store}>
      <Router />
    </Provider>,
    document.getElementById('root'),
  );
});
