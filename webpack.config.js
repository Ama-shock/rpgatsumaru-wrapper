
module.exports = {
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-Loader'
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    }
};
