import {
  Box,
  Text,
  TableRoot,
  TableBody,
  TableColumnHeader,
  TableCell,
  TableHeader,
  TableRow,
  Flex,
} from "@bleh-ui/react";
import { useAtomValue } from "jotai";
import { themeSpacingTokensAtom } from "@/atoms/spacingTokens";
import { useState } from "react";

export const SpacingTokenDemo = () => {
  const [showPx, setShowPx] = useState(true);
  const [demoAltLook, setDemoAltLook] = useState(false);
  const spacingTokens = useAtomValue(themeSpacingTokensAtom);

  const formatterFn = (remVal) => {
    return showPx ? `${parseFloat(remVal) * 16}px` : `${remVal}`;
  };

  return (
    <Box>
      <TableRoot>
        <TableHeader>
          <TableRow>
            <TableColumnHeader textAlign="right">Token</TableColumnHeader>
            <TableColumnHeader textAlign="right">Value</TableColumnHeader>
            <TableColumnHeader>Demo</TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {spacingTokens.map((item) => (
            <TableRow key={item.id} id={item.id}>
              <TableCell width="8ch">
                <Text textAlign="right" fontFamily="mono">
                  {item.label}
                </Text>
              </TableCell>
              <TableCell
                width="10ch"
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
