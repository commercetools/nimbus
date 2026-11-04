import { Box, Code, system } from "@commercetools/nimbus";
import { tokensOf } from "../theme-tokens";
import { TokenTable } from "../token-table";

type BordersKind = "tokens" | "colors";

/** A sample box. The border tokens are shown with the color `border`. */
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
 * that each one points to, such as `neutral.6`.
 */
const borderColors = () => {
  const definitions = (system._config.theme?.semanticTokens?.colors?.border ??
    {}) as Record<string, { value: unknown }>;
  return Object.entries(definitions).map(([key, definition]) => ({
    id: key === "DEFAULT" ? "border" : `border.${key}`,
    // `{colors.neutral.6}` is shown as `neutral.6`.
    refersTo: String(definition.value).replace(/^\{colors\.(.+)\}$/, "$1"),
  }));
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
              <Sample key="sample" border="solid-50" borderColor={item.id} />,
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
            <Sample key="sample" border={item.id} borderColor="border" />,
          ],
        }))}
      />
    </Box>
  );
};
