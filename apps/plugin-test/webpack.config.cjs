const path = require("path");
const webpack = require("webpack");

// Uses the same regex and NormalModuleReplacementPlugin mechanism as the real
// NimbusOptionalDependencyPlugin, but always activates (bypasses detection)
// so we can verify the stubbing path works inside the monorepo where nimbus
// IS installed.
const NIMBUS_RUNTIME_RE =
  /^@commercetools\/nimbus(?:$|\/(?!plugins(?:\/|$)))/;

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
