import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { UNSAFE_nimbusOptionalDependency } from "@commercetools/nimbus/plugins/vite";

// https://vite.dev/config/
export default defineConfig(() => {
  const isAnalyzeMode = !!process.env.ANALYZE_BUNDLE;

  return {
    plugins: [
      react(),
      UNSAFE_nimbusOptionalDependency(),
      // Bundle visualizer — run with `pnpm build:analyze` to generate bundle-report.html
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
