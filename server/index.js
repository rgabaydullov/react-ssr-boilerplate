import express from 'express';
import webpack from 'webpack';
import { matchRoutes } from 'react-router-config';
import Loadable from 'react-loadable';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import CircularJSON from 'circular-json';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import render from './render';
import webpackConfigClient from '../webpack.config';
import domains from '../config/domains.json';
import store from '../dev/src/store';
import Routes from '../dev/src/router/Routes';

/* eslint no-console: ["error", { allow: ["log", "error"] }] */

const ENV = process.env.NODE_ENV
  ? process.env.NODE_ENV
  : 'development';
const ENVIRONMENT = domains[ENV];
// const HOST = process.env.HOST || ENVIRONMENT[0] || 'http://example.com';
const PORT = process.env.PORT || ENVIRONMENT[1] || 8000;
// const ONE_MONTH = 2678400; // Seconds
const app = express();
const clientCompiler = webpack(webpackConfigClient);

// const extractDomain = (url) => {
//   const match = url.match(/^(?:https?:\/\/)?(?:[^@/\n]+@)?(?:www\.)?([^:/\n]+)/i);
//   return match
//     ? match[1]
//     : '';
// };
// const cookieDomain = `.${extractDomain(HOST)}`;

app.disable('x-powered-by'); // Disable Express header
app.set('port', PORT);
app.set('trust proxy');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Passport configuration
// app.use(session({
//   secret: 'YOUR_SECRET_KEY_HERE',
//   resave: true,
//   cookie: { httpOnly: false, maxAge: ONE_MONTH * 1000, domain: cookieDomain },
//   saveUninitialized: false,
//   rolling: true,
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// Register API middleware
/* eslint global-require: "error" */


// Register Webpack dev tools only for NODE_ENV=development
if (ENV === 'development') {
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

// Register SSR middleware
app.use(express.static('dist'));

// Render Basic template with fetchOnHydrate preloading
// See React Loadable
app.get('*', async ({ path }, res) => {
  const matchedComponents = matchRoutes(Routes, path).map(({ route, match }) => {
    const { component } = route;
    const { params } = match;
    const preloadableComponent = (component.preload
      ? component.preload().then(pc => pc.default)
      : component);
    return preloadableComponent
      .then(({ fetchOnHydrate }) => (fetchOnHydrate
        ? fetchOnHydrate(store.dispatch, { path, params })
        : [])); // provide method to preload needed data
  });
  const preloadedComponents = await Promise.all(matchedComponents);
  const actions = preloadedComponents
    .map(async (actionsToDispatch) => {
      const dispatchedActions = await Promise.all(actionsToDispatch.map(actionPromise => (
        actionPromise && new Promise(resolve => actionPromise.then(resolve).catch(resolve)))));
      return dispatchedActions;
    }); // dispatch an actions accordingly their experience

  await Promise.all(actions);
  const content = render(path, store, {});

  res.status(200).send(content);
});

app.use((err, req, res) => {
  // error handling logic
  try {
    console.error(err);
  } catch (e) {
    console.error(CircularJSON.stringify(err));
  }

  res.status(500).send('Internal error');
});

Loadable.preloadAll().then(() => {
  app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
}).catch(console.error);
