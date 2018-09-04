import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import { Helmet } from 'react-helmet';
import Html from './Html';
import Routes from '../dev/src/router/Routes';
import stats from './react-loadable.json';

export default (pathname, store, context) => {
  const modules = [];
  const content = renderToString(
    <Loadable.Capture report={moduleName => modules.push(moduleName)}>
      <Provider store={store}>
        <StaticRouter location={pathname} context={context}>
          <div>
            <Helmet
              titleTemplate="%s | Website"
              defaultTitle="Website"
            >
              <html lang="ru" />
              <body className="theme-light" />
            </Helmet>
            {renderRoutes(Routes)}
          </div>
        </StaticRouter>
      </Provider>
    </Loadable.Capture>,
  );
  const assets = getBundles(stats, modules);
  const html = renderToString(
    <Html
      assets={assets}
      html={content}
      store={store}
    />,
  );

  return `<!DOCTYPE html>${html}`;
};
