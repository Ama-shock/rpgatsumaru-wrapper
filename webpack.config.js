
module.exports = {
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'script-loader'
        }
      ]
    },
    resolve: {
      extensions: ['.ts']
    }
};
