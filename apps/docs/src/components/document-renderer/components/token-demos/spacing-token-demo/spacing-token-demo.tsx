import { Box, Table, Flex, Code } from "@commercetools/nimbus";
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
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader width="8ch" textAlign="right">
              Token
            </Table.ColumnHeader>
            <Table.ColumnHeader width="12ch" textAlign="right">
              Value
            </Table.ColumnHeader>
            <Table.ColumnHeader>Demo</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {spacingTokens.map((item) => (
            <Table.Row key={item.id} id={item.id}>
              <Table.Cell>
                <Code variant="subtle">{item.label}</Code>
              </Table.Cell>
              <Table.Cell
                onClick={() => setShowPx(!showPx)}
                cursor="pointer"
                textAlign="right"
              >
                {formatterFn(item.value.originalValue)}
              </Table.Cell>
              <Table.Cell
                cursor="pointer"
                onClick={() => setDemoAltLook(!demoAltLook)}
              >
                <Flex>
                  {demoAltLook && (
                    <Box flexGrow="1" height="400" bg="primary.3" />
                  )}

                  <Box
                    width={item.value.originalValue}
                    height="400"
                    bg="primary.9"
                  />

                  <Box flexGrow="1" height="400" bg="primary.3" />
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
