/* eslint-disable react/no-danger */
import React from 'react';
import { string, arrayOf, shape } from 'prop-types';
import store from '../dev/src/store';

const Html = ({ assets, html }) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <link rel="stylesheet" href="/styles.css" />
      <title>
        Title
      </title>
    </head>
    <body>
      <div id="root" dangerouslySetInnerHTML={{ __html: html }} />
      <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__ = ${JSON.stringify(store.getState())}` }} />
      <script src="/vendor.js" />
      {assets.map(({ file }) => (file.match(/\.(js)$/)
        ? (<script src={`/${file}`} key={file} />)
        : null))}
    </body>
  </html>
);

Html.propTypes = {
  html: string.isRequired,
  assets: arrayOf(shape({})).isRequired,
};

export default Html;
