const path = require("path");
const glob = require("glob");
const entries = {};
const srcDir = "./src/js/entries"

glob.sync('**/*.js', {
  ignore: '**/_*.js',
  cwd: srcDir
}).map((value) => {
  entries[value] = path.resolve(srcDir, value);
});


module.exports = {
  entry: entries,
  output: {
    filename: '[name]',
  },
  resolve: {
    extensions: ['.js', '.css'],
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: ['babel-loader'],
      exclude: /node_modules/,
    }, ],
  },
};
