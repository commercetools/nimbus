import { useEffect, useId, useState, type FC } from "react";
import { Box, InlineSvg } from "@commercetools/nimbus";
import { scopeIllustrationIds } from "./scope-illustration-ids";

/**
 * The SVGs are rendered from the `*.illustration.ts` sources in the nimbus
 * package into `src/data/illustrations` by `pnpm illustrations:generate`, which
 * the docs build and the dev server run. They load lazily, so a page only
 * fetches the ones it shows.
 */
const loaders = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>("../../data/illustrations/*.svg", {
      query: "?raw",
      import: "default",
    })
  ).map(([file, load]) => [file.split("/").pop()!.replace(".svg", ""), load])
);

/** Whether an illustration file exists for this component name. */
export const hasIllustration = (name?: string): name is string =>
  !!name && name in loaders;

/**
 * Shows the illustration of a component. The SVG follows the `colorPalette`
 * of its wrapper (`primary`) and the active color mode.
 */
export const ComponentIllustration: FC<{ name: string }> = ({ name }) => {
  const instanceId = useId();
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loaders[name]?.().then((raw) => {
      if (!cancelled) setSvg(scopeIllustrationIds(raw, name, instanceId));
    });
    return () => {
      cancelled = true;
    };
  }, [name, instanceId]);

  return (
    <Box
      colorPalette="primary"
      width="full"
      height="full"
      css={{ "& svg": { display: "block", width: "100%", height: "100%" } }}
    >
      {svg && <InlineSvg data={svg} />}
    </Box>
  );
};
