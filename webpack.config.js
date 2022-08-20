const path = require('path');

module.exports = {
    mode: "production",
    entry: "./js/index.js",
    output: {
        path: path.resolve(__dirname, "assets/"),
        filename: "index.min.js"
    },
    module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
    }
}