import path from 'path';
import webpack from 'webpack';
import { spawn } from 'child_process';
import webpackConfigClient from '../webpack.config';
import wepbackConfigServer from './webpack.config';

const STATS_OUTPUT_STYLE = {
  colors: true,
  timings: true,
};
const clientCompiler = webpack(webpackConfigClient);
const serverCompiler = webpack(wepbackConfigServer);

let serverControl;
// Run Webpack Client compiler
clientCompiler.run((err, clientStats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  const info = clientStats.toJson();

  if (clientStats.hasErrors()) {
    info.errors.forEach(message => console.log(message));
    return;
  }

  if (clientStats.hasWarnings()) {
    info.warnings.forEach(message => console.log(message));
  }
  // log Webpack CLIENT build stats
  console.log(clientStats.toString(STATS_OUTPUT_STYLE));

  // Run Webpack Server compiler
  serverCompiler.run((serverErr, serverStats) => {
    if (serverErr) {
      console.error(serverErr.stack || serverErr);
      if (serverErr.details) {
        console.error(serverErr.details);
      }
      return;
    }

    // log Webpack SERVER build stats
    console.log(serverStats.toString(STATS_OUTPUT_STYLE));

    if (!serverControl) {
      serverControl = spawn('babel-node', [path.resolve(__dirname, '../dist/server.js')]);
      serverControl.stdout.on('data', data => console.log(data.toString()));
      serverControl.stderr.on('data', data => console.error(data.toString()));
    }
  });
});
