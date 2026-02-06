import { preferPxAtom } from "@/atoms/prefer-px-atom";
import { themeSizeTokensAtom } from "@/atoms/theme-size-tokens.ts";
import { Box, DataTable, Flex, Code } from "@commercetools/nimbus";
import { useAtom, useAtomValue } from "jotai";
import orderBy from "lodash/orderBy";
import { ReactElement } from "react";

// Define sorter functions for different token types
const sorter = {
  regular: (obj: { value: { originalValue: string } }) =>
    parseFloat(obj.value.originalValue),
  fraction: () => [
    (fraction: string) => parseInt(fraction.split("/")[1]),
    (fraction: string) => {
      const parts = fraction.split("/");
      if (parts.length === 2) {
        return parseFloat(parts[0]) / parseFloat(parts[1]);
      }
      return 0;
    },
  ],
  other: (obj: { label: string }) => obj.label,
};

type SorterKeys = keyof typeof sorter;

interface SizesTokenDemoProps {
  group: string;
}

interface SizeToken {
  id: string;
  label: string;
  group: string;
  value: {
    originalValue: string;
  };
}

/**
 * SizesTokenDemo component to display size tokens in a table format.
 * @param {SizesTokenDemoProps} props - The props for the component.
 * @returns {ReactElement | null} The rendered component.
 */
export const SizesTokenDemo = ({
  group,
}: SizesTokenDemoProps): ReactElement | null => {
  const [showPx, setShowPx] = useAtom(preferPxAtom);
  const sizeTokens = useAtomValue(themeSizeTokensAtom) as SizeToken[] | null;

  if (!sizeTokens) return null;

  // Filter and sort size tokens based on the group
  const subset = orderBy(
    sizeTokens.filter((item) => item.group === group),
    sorter[(group || "other") as SorterKeys]
  );

  /**
   * Formatter function to convert values between rem and px.
   * @param {string} val - The value to format.
   * @returns {string} The formatted value.
   */
  const formatterFn = (val: string): string => {
    switch (true) {
      case val.includes("rem"):
        return showPx ? `${parseFloat(val) * 16}px` : `${val}`;
      case val.includes("px"):
        return !showPx ? `${parseFloat(val) / 16}rem` : `${val}`;
      default:
        return val;
    }
  };

  const columns = [
    {
      id: "token",
      header: "Token",
      accessor: (row: SizeToken) => row.label,
      width: 200,
      render: ({ value }: { value: string }) => (
        <Code variant="subtle">{value}</Code>
      ),
    },
    {
      id: "value",
      header: "Value",
      accessor: (row: SizeToken) => row.value.originalValue,
      width: 200,
      render: ({ value }: { value: string }) => (
        <Box onClick={() => setShowPx(!showPx)} cursor="button">
          {formatterFn(value)}
        </Box>
      ),
    },
    {
      id: "demo",
      header: "Demo",
      accessor: (row: SizeToken) => row.value.originalValue,
      render: ({ value }: { value: string }) => (
        <Box position="relative">
          <Flex minHeight="1em" overflow="hidden">
            <Box width="100%" maxWidth={value} height="400" bg="primary.9" />
            <Box flexGrow="1" height="400" bg="primary.3" />
          </Flex>
          <Flex
            position="absolute"
            right="0"
            top="0"
            height="400"
            bgImage="linear-gradient(to right, transparent, {colors.primary.3})"
            width="600"
          />
        </Box>
      ),
    },
  ];

  return (
    <Box mb="1200" mt="600">
      <DataTable columns={columns} rows={subset} />
    </Box>
  );
};
