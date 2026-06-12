const path = require("path");
const {
  UNSAFE_NimbusOptionalDependencyPlugin,
} = require("@commercetools/nimbus/plugins/webpack");

module.exports = {
  entry: "./src/webpack-entry.js",
  output: {
    path: path.resolve(__dirname, "dist-webpack"),
    filename: "bundle.js",
  },
  plugins: [new UNSAFE_NimbusOptionalDependencyPlugin()],
};
