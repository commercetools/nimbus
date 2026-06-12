const path = require("path");
const webpack = require("webpack");
const {
  NIMBUS_RUNTIME_RE,
} = require("@commercetools/nimbus/plugins/webpack");

// Always-active version of NimbusOptionalDependencyPlugin that bypasses
// detection, so we can verify the stubbing path inside the monorepo where
// nimbus IS installed.
module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist-webpack"),
    filename: "bundle.js",
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      NIMBUS_RUNTIME_RE,
      "@commercetools/nimbus/plugins/stub"
    ),
  ],
};
