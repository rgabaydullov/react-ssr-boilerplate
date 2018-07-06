import express from 'express';
import webpack from 'webpack';
import { matchRoutes } from 'react-router-config';
import Loadable from 'react-loadable';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import render from './render';
import webpackConfigClient from '../webpack.config';
import store from '../dev/src/store';
import Routes from '../dev/src/router/Routes';

const PORT = process.env.PORT || 8000;
const app = express();
const clientCompiler = webpack(webpackConfigClient);

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  app.use(webpackDevMiddleware(clientCompiler, {
    noInfo: true,
    publicPath: webpackConfigClient.output.publicPath,
  }));
  app.use(webpackHotMiddleware(clientCompiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
  }));
}
app.use('/dist', express.static('dist'));
app.use((req, res, next) => {
  if (/\.js|\.css/.test(req.path)) {
    res.redirect(`/dist${req.path}`);
  } else {
    next();
  }
});
app.use(/\.js$/, express.static('dist'));

// Render Basic template with fetchOnHydrate preloading
app.get('*', async ({ path }, res) => {
  const matchedComponents = matchRoutes(Routes, path)
    .map(({ route }) => (route.component.preload
      ? route.component.preload().then(pc => pc.default)
      : route.component));
  const preloadedComponents = await Promise.all(matchedComponents);
  const actions = preloadedComponents
    .map(({ fetchOnHydrate }) => (fetchOnHydrate
      ? fetchOnHydrate(store.dispatch, { path })
      : [])) // provide method to preload needed data
    .map(async (actionsToDispatch) => {
      const dispatchedActions = await Promise.all(actionsToDispatch.map(actionPromise => (
        actionPromise && new Promise(resolve => actionPromise.then(resolve).catch(resolve)))));
      return dispatchedActions;
    }); // dispatch an actions accordingly their experience

  await Promise.all(actions);
  const content = render(path, store, {});

  res.status(200).send(content);
});

Loadable.preloadAll().then(() => {
  app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
}).catch(console.error);
