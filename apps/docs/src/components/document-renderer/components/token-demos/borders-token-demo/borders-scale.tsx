import { Box, Code, system } from "@commercetools/nimbus";
import { tokensOf } from "../theme-tokens";
import { TokenTable } from "../token-table";

type BordersKind = "tokens" | "colors";

/** A sample box with a border. */
const Sample = (props: { border: string; borderColor?: string }) => (
  <Box
    width="2400"
    height="1000"
    borderRadius="100"
    bg="bg"
    aria-hidden
    {...props}
  />
);

/**
 * The border colors: the `border` color and its variants, with the color
 * that each one points to, such as `neutral.6`. The neutral colors come first,
 * from the weakest to the strongest, then the status colors in the order of
 * the theme.
 */
const borderColors = () => {
  const definitions = (system._config.theme?.semanticTokens?.colors?.border ??
    {}) as Record<string, { value: unknown }>;
  const colors = Object.entries(definitions).map(([key, definition]) => ({
    id: key === "DEFAULT" ? "border" : `border.${key}`,
    // `{colors.neutral.6}` is shown as `neutral.6`.
    refersTo: String(definition.value).replace(/^\{colors\.(.+)\}$/, "$1"),
  }));
  // The step of a neutral color. The status colors get 13, after the 12
  // steps of a palette.
  const rank = (refersTo: string) => {
    const match = /^neutral\.(\d+)$/.exec(refersTo);
    return match ? Number(match[1]) : 13;
  };
  // A stable sort: `border` stays before `border.subtle`, which has the same
  // step.
  return colors.sort((a, b) => rank(a.refersTo) - rank(b.refersTo));
};

interface BordersScaleProps {
  /** `tokens` for the border tokens, `colors` for the border colors. */
  kind: BordersKind;
}

/**
 * The border tokens with their width and a sample, or the border colors with
 * the color they point to and a sample.
 */
export const BordersScale = ({ kind }: BordersScaleProps) => {
  if (kind === "colors") {
    return (
      <Box my="600">
        <TokenTable
          tokenWidth="20ch"
          columns={[{ header: "Color", width: "14ch" }, { header: "Sample" }]}
          rows={borderColors().map((item) => ({
            id: item.id,
            cells: [
              <Code key="color" variant="subtle">
                {item.refersTo}
              </Code>,
              <Sample key="sample" border="solid-25" borderColor={item.id} />,
            ],
          }))}
        />
      </Box>
    );
  }

  return (
    <Box my="600">
      <TokenTable
        columns={[{ header: "Value", width: "14ch" }, { header: "Sample" }]}
        rows={tokensOf("borders").map((item) => ({
          id: item.id,
          cells: [
            item.value,
            <Sample
              key="sample"
              border={item.id}
              borderColor="border.emphasized"
            />,
          ],
        }))}
      />
    </Box>
  );
};
