const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = [
  {
    mode: "development",
    entry: "./main.ts",
    target: "electron-main",
    resolve: {
      extensions: [".ts", "..."],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ loader: "ts-loader" }],
        },
      ],
    },
    output: {
      path: __dirname + "/",
      filename: "electron-bundle.js",
    },
  },
];
