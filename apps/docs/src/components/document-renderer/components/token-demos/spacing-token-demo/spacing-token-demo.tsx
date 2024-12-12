import {
  Box,
  TableRoot,
  TableBody,
  TableColumnHeader,
  TableCell,
  TableHeader,
  TableRow,
  Flex,
  Code,
} from "@bleh-ui/react";
import { useAtom, useAtomValue } from "jotai";
import { themeSpacingTokensAtom } from "@/atoms/spacing-tokens.ts";
import { useState } from "react";
import { preferPxAtom } from "@/atoms/prefer-px-atom";

export const SpacingTokenDemo = () => {
  const [showPx, setShowPx] = useAtom(preferPxAtom);
  const [demoAltLook, setDemoAltLook] = useState(false);
  const spacingTokens = useAtomValue(themeSpacingTokensAtom);

  const formatterFn = (val: string) => {
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
    <Box>
      <TableRoot>
        <TableHeader>
          <TableRow>
            <TableColumnHeader width="8ch" textAlign="right">
              Token
            </TableColumnHeader>
            <TableColumnHeader width="12ch" textAlign="right">
              Value
            </TableColumnHeader>
            <TableColumnHeader>Demo</TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {spacingTokens.map((item) => (
            <TableRow key={item.id} id={item.id}>
              <TableCell>
                <Code variant="subtle">{item.label}</Code>
              </TableCell>
              <TableCell
                onClick={() => setShowPx(!showPx)}
                cursor="pointer"
                textAlign="right"
              >
                {formatterFn(item.value.originalValue)}
              </TableCell>
              <TableCell
                cursor="pointer"
                onClick={() => setDemoAltLook(!demoAltLook)}
              >
                <Flex>
                  {demoAltLook && (
                    <Box flexGrow="1" height="4" bg="primary.3" />
                  )}

                  <Box
                    width={item.value.originalValue}
                    height="4"
                    bg="primary.9"
                  />

                  <Box flexGrow="1" height="4" bg="primary.3" />
                </Flex>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </Box>
  );
};
