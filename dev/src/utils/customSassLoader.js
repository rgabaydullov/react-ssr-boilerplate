const nodeSass = require('node-sass'); // eslint-disable-line import/no-extraneous-dependencies

const variables = {
  colorBg: '#f0f',
};
const hex2rgb = require('./hex2rgb').default;
// const js2scssThemeProvider = require('../js2scssThemeProvider')();

const sassVars = {
  ...variables,
  // ...js2scssThemeProvider,
};

module.exports = {
  loader: 'sass-loader',
  options: {
    ident: 'by-rishat',
    functions: {
      getVars(sassKey) {
        const key = sassKey.getValue();
        const value = sassVars[key];
        const { types } = nodeSass;
        let sassCast;

        switch (true) {
          case /^color/i.test(key): {
            const rgbColor = hex2rgb(value);
            sassCast = new types.Color(rgbColor.r, rgbColor.g, rgbColor.b);
            break;
          }
          case /\d+/.test(value): {
            const [digit, unit] = value.match(/(\d*\.?\d+)\s?(px|rem|em|%+)/im).slice(1, 3);
            sassCast = new types.Number(+digit, unit);
            break;
          }
          default:
            sassCast = new types.String(value);
            break;
        }
        return sassCast;
      },
    },
  },
};
