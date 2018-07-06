import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
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
            {renderRoutes(Routes)}
          </div>
        </StaticRouter>
      </Provider>
    </Loadable.Capture>,
  );

  const html = renderToString(
    <Html
      assets={getBundles(stats, modules)}
      html={content}
    />,
  );

  return `<!DOCTYPE html>${html}`;
};
