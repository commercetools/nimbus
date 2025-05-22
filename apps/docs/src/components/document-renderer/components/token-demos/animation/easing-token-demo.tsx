import { Box, Button, Code, Table } from "@commercetools/nimbus";

import { atom, useAtomValue } from "jotai";
import { system } from "@commercetools/nimbus";
import CubicBezier from "./cubic-bezier";
import AnimationDemo from "./animation-demo";
import { useState } from "react";
import { PlayArrow } from "@commercetools/nimbus-icons";

export const easingTokensAtom = atom(() => {
  const tokenMap = system.tokens.categoryMap.get("easings");
  const obj = tokenMap ? Object.fromEntries(tokenMap) : {};

  const arr = Object.keys(obj).map((key) => {
    return {
      id: key,
      label: key,
      value: obj[key],
    };
  });

  return arr;
});

export const EasingTokenDemo = () => {
  const [seed, setSeed] = useState(0);
  const items = useAtomValue(easingTokensAtom);

  return (
    <Box mb="1200" mt="600">
      <Table.Root width="full" maxWidth="full">
        <Table.ColumnGroup>
          <Table.Column width="18ch" />
          <Table.Column width="3600" />
          <Table.Column />
        </Table.ColumnGroup>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Token-Name</Table.ColumnHeader>
            <Table.ColumnHeader>Curve</Table.ColumnHeader>
            <Table.ColumnHeader>
              Demo
              <Button
                size="2xs"
                float="right"
                onPress={() => setSeed(seed + 1)}
                colorPalette="primary"
                variant="solid"
              >
                <PlayArrow /> Trigger animations
              </Button>
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((item) => (
            <Table.Row key={item.id} id={item.id}>
              <Table.Cell>
                <Code variant="subtle">{item.label}</Code>
              </Table.Cell>
              <Table.Cell>
                <CubicBezier size="80px" bezier={item.value.originalValue} />
              </Table.Cell>
              <Table.Cell>
                <AnimationDemo
                  key={seed}
                  size="80px"
                  curve={item.value.originalValue}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
