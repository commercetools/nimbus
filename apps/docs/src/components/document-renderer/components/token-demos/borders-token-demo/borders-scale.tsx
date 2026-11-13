import { Box } from "@commercetools/nimbus";
import { tokensOf } from "../theme-tokens";
import { TokenTable } from "../token-table";

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

/** The border tokens with their width and a sample. */
export const BordersScale = () => (
  <Box my="600">
    <TokenTable
      columns={[{ header: "Value", width: "14ch" }, { header: "Sample" }]}
      rows={tokensOf("borders").map((item) => ({
        id: item.id,
        cells: [
          item.value,
          <Sample key="sample" border={item.id} borderColor="neutral.7" />,
        ],
      }))}
    />
  </Box>
);
