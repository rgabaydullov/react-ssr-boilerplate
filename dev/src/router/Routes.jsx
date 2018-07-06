import React from 'react';
import Loadable from 'react-loadable';

const loading = () => (
  <div>
    Loading...
  </div>
);

export default [
  {
    component: Loadable({
      loader: () => import('../pages/Page1'),
      loading,
    }),
    path: '/',
    exact: true,
  },
  {
    component: Loadable({
      loader: () => import('../pages/Page2'),
      loading,
    }),
    path: '/:pageName',
  },
];
