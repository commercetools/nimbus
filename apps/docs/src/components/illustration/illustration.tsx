import { useEffect, useId, useState, type FC } from "react";
import { Box, InlineSvg, type BoxProps } from "@commercetools/nimbus";
import { scopeIllustrationIds } from "./scope-illustration-ids";
import { illustrationA11yProps } from "./illustration-a11y";

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

/** Whether an illustration file exists for this name. */
export const hasIllustration = (name?: string): name is string =>
  !!name && name in loaders;

export type IllustrationProps = Omit<BoxProps, "children"> & {
  /**
   * Name of the illustration: the file name of its `<name>.illustration.ts`
   * source, for example `button`, `date-picker` or `design-tokens`.
   */
  name: string;
  /**
   * Accessible name. Without it the illustration is decorative and hidden from
   * assistive technology. Set it only when the picture carries information
   * that the text around it does not give.
   */
  alt?: string;
};

/**
 * Shows an illustration by name. It fills its parent unless size props
 * (`boxSize`, `width`, `height`, ...) are set. The SVG follows the
 * `colorPalette` (`primary` by default) and the active color mode.
 */
export const Illustration: FC<IllustrationProps> = ({
  name,
  alt,
  ...boxProps
}) => {
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
      {...illustrationA11yProps(alt)}
      {...boxProps}
    >
      {svg && (
        // the outer box takes the caller's props; this one makes the SVG fill it
        <Box
          width="full"
          height="full"
          css={{
            "& svg": { display: "block", width: "100%", height: "100%" },
          }}
        >
          <InlineSvg data={svg} />
        </Box>
      )}
    </Box>
  );
};
