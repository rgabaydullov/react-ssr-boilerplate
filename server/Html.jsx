/* eslint-disable react/no-danger */
import React from 'react';
import { string, arrayOf, shape } from 'prop-types';
import serialize from 'serialize-javascript';
import { Helmet } from 'react-helmet';
// assets
// import appleTouchIconx57 from './assets/apple-icon-57x57.png';
// import appleTouchIconx60 from './assets/apple-icon-60x60.png';
// import appleTouchIconx72 from './assets/apple-icon-72x72.png';
// import appleTouchIconx76 from './assets/apple-icon-76x76.png';
// import appleTouchIconx114 from './assets/apple-icon-114x114.png';
// import appleTouchIconx120 from './assets/apple-icon-120x120.png';
// import appleTouchIconx144 from './assets/apple-icon-144x144.png';
// import appleTouchIconx152 from './assets/apple-icon-152x152.png';
// import appleTouchIconx180 from './assets/apple-icon-180x180.png';
// import androidIconx192 from './assets/android-icon-192x192.png';
// import faviconx32 from './assets/favicon-32x32.png';
// import faviconx96 from './assets/favicon-96x96.png';
// import faviconx16 from './assets/favicon-16x16.png';
// import msIconx144 from './assets/ms-icon-144x144.png';

const Html = ({ assets, html, store }) => {
  const styles = assets.filter(({ file }) => file.endsWith('.css'));
  const scripts = assets.filter(({ file }) => file.endsWith('.js'));

  const initialState = store.getState();
  const htmlData = Helmet.renderStatic();

  return (
    <html lang="en" {...htmlData.htmlAttributes.toComponent()}>
      <head>
        <meta charSet="utf-8" />
        {/* <link rel="apple-touch-icon" sizes="57x57" href={appleTouchIconx57} />
        <link rel="apple-touch-icon" sizes="60x60" href={appleTouchIconx60} />
        <link rel="apple-touch-icon" sizes="72x72" href={appleTouchIconx72} />
        <link rel="apple-touch-icon" sizes="76x76" href={appleTouchIconx76} />
        <link rel="apple-touch-icon" sizes="114x114" href={appleTouchIconx114} />
        <link rel="apple-touch-icon" sizes="120x120" href={appleTouchIconx120} />
        <link rel="apple-touch-icon" sizes="144x144" href={appleTouchIconx144} />
        <link rel="apple-touch-icon" sizes="152x152" href={appleTouchIconx152} />
        <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIconx180} />
        <link rel="icon" type="image/png" sizes="192x192" href={androidIconx192} />
        <link rel="icon" type="image/png" sizes="32x32" href={faviconx32} />
        <link rel="icon" type="image/png" sizes="96x96" href={faviconx96} />
        <link rel="icon" type="image/png" sizes="16x16" href={faviconx16} />
        <meta name="msapplication-TileColor" content="#394247" />
        <meta name="msapplication-TileImage" content={msIconx144} /> */}
        <meta name="theme-color" content="#394247" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0, shrink-to-fit=no, minimal-ui=yes" />
        <meta name="apple-mobile-web-app-title" content="Website" />
        <link rel="icon" type="image/png" href="/assets/logo/favicon-large.png" sizes="196x196" />
        <link rel="icon" type="image/png" href="/assets/logo/favicon.png" sizes="96x96" />
        <link type="text/css" rel="stylesheet" href="/styles.css" />
        {styles.map(({ file }) => (
          <link type="text/css" rel="stylesheet" href={`/${file}`} key={file} />
        ))}
        {htmlData.meta.toComponent()}
        {htmlData.title.toComponent()}
        {htmlData.link.toComponent()}
      </head>
      <body {...htmlData.bodyAttributes.toComponent()}>
        <div
          id="root"
          className="cls-root"
          style={{
            display: 'none',
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__ = ${serialize(initialState, { isJSON: true })}` }} />
        <script src="/vendor.js" />
        <script src="/app.js" defer />
        {scripts.map(({ file }) => (
          <script src={`/${file}`} key={file} defer />
        ))}
      </body>
    </html>
  );
};

Html.propTypes = {
  html: string.isRequired,
  assets: arrayOf(shape({})).isRequired,
  store: shape({}).isRequired,
};

export default Html;
