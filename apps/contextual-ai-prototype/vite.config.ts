import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { UNSAFE_nimbusOptionalDependency } from "@commercetools/nimbus/plugins/vite";

// https://vite.dev/config/
export default defineConfig(() => {
  const isAnalyzeMode = !!process.env.ANALYZE_BUNDLE;

  return {
    // GitHub Pages serves from /contextual-ai-prototype/ subpath
    base: process.env.GITHUB_PAGES ? "/nimbus/" : "/",
    plugins: [
      react(),
      UNSAFE_nimbusOptionalDependency(),
      ...(isAnalyzeMode
        ? [
            import("rollup-plugin-visualizer").then((m) =>
              m.visualizer({
                filename: "bundle-report.html",
                gzipSize: true,
              })
            ),
          ]
        : []),
    ],
  };
});
