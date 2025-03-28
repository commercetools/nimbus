import { preferPxAtom } from "@/atoms/prefer-px-atom";
import { themeSizeTokensAtom } from "@/atoms/theme-size-tokens.ts";
import {
  Box,
  TableRoot,
  TableBody,
  TableColumnHeader,
  TableCell,
  TableHeader,
  TableRow,
  Flex,
  TableColumnGroup,
  TableColumn,
  Code,
} from "@nimbus/react";
import { useAtom, useAtomValue } from "jotai";
import orderBy from "lodash/orderBy";

// Define sorter functions for different token types
const sorter = {
  regular: (obj: { value: { originalValue: string } }) =>
    parseFloat(obj.value.originalValue),
  fraction: () => [
    (fraction: string) => parseInt(fraction.split("/")[1]),
    (fraction: string) => eval(fraction),
  ],
  other: (obj: { label: string }) => obj.label,
};

type SorterKeys = keyof typeof sorter;

interface SizesTokenDemoProps {
  group: string;
}

/**
 * SizesTokenDemo component to display size tokens in a table format.
 * @param {SizesTokenDemoProps} props - The props for the component.
 * @returns {JSX.Element | null} The rendered component.
 */
export const SizesTokenDemo = ({
  group,
}: SizesTokenDemoProps): JSX.Element | null => {
  const [showPx, setShowPx] = useAtom(preferPxAtom);
  const sizeTokens = useAtomValue(themeSizeTokensAtom);

  if (!sizeTokens) return null;

  // Filter and sort size tokens based on the group
  const subset = orderBy(
    sizeTokens.filter((item) => item.group === group),
    sorter[(group || "other") as SorterKeys]
  ) as typeof sizeTokens;

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

  return (
    <Box mb="1200" mt="600">
      <TableRoot width="full" maxWidth="full">
        <TableColumnGroup>
          <TableColumn width="18ch" />
          <TableColumn width="18ch" />
          <TableColumn maxWidth="1600" />
        </TableColumnGroup>
        <TableHeader>
          <TableRow>
            <TableColumnHeader>Token</TableColumnHeader>
            <TableColumnHeader>Value</TableColumnHeader>
            <TableColumnHeader>Demo</TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subset.map((item) => {
            return (
              <TableRow key={item.id} id={item.id}>
                <TableCell>
                  <Code variant="subtle">{item.label}</Code>
                </TableCell>
                <TableCell onClick={() => setShowPx(!showPx)} cursor="button">
                  {formatterFn(item.value.originalValue)}
                </TableCell>
                <TableCell>
                  <Box position="relative">
                    <Flex minHeight="1em" overflow="hidden">
                      <Box
                        width="100%"
                        maxWidth={item.value.originalValue}
                        height="400"
                        bg="primary.9"
                      />
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </TableRoot>
    </Box>
  );
};
