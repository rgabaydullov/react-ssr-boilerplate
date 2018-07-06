import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import Routes from './Routes';

const Router = () => (
  <BrowserRouter>
    <div>
      {renderRoutes(Routes)}
    </div>
  </BrowserRouter>
);

export default Router;
