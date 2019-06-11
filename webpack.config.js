module.exports = {
  entry: {
    common: './src/js/entries/common.js',
    top: './src/js/entries/top.js',
  },
  output: {
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: ['babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },
};
