import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
import Routes from './Routes';

const Router = () => (
  <BrowserRouter>
    <div>
      <Helmet
        titleTemplate="%s | Website"
        defaultTitle="Website"
      >
        <html lang="ru" />
        <body className="theme-light" />
      </Helmet>
      {/* <Header /> */}
      <main>
        {renderRoutes(Routes)}
      </main>
      {/* <Footer /> */}
    </div>
  </BrowserRouter>
);

export default Router;
