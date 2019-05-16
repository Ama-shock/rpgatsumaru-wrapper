module.exports = {
    entry: './demo/app.ts',
    output: {
      path: __dirname +'/demo'
    },
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
