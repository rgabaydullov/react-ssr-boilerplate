import React from 'react';
import Loadable from 'react-loadable';

const Loading = () => (
  <div>
    Loading...
  </div>
);

const Page1 = Loadable({
  loader: () => import('../pages/Page1'),
  loading: Loading,
});

const Page2 = Loadable({
  loader: () => import('../pages/Page2'),
  loading: Loading,
});

export default [
  {
    component: Page1,
    path: '/',
    exact: true,
  },
  {
    component: Page2,
    path: '/:pageName',
  },
];
