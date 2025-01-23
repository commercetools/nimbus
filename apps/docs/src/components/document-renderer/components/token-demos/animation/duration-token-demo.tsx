import {
  Box,
  Button,
  Code,
  TableBody,
  TableCell,
  TableColumn,
  TableColumnGroup,
  TableColumnHeader,
  TableHeader,
  TableRoot,
  TableRow,
} from "@bleh-ui/react";

import { atom, useAtomValue } from "jotai";
import { system } from "@bleh-ui/react";
import AnimationDemo from "./animation-demo";
import { useState } from "react";
import { Play } from "@bleh-ui/icons";

export const durationTokensAtom = atom(() => {
  const tokenMap = system.tokens.categoryMap.get("durations");
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

export const DurationTokenDemo = () => {
  const [seed, setSeed] = useState(0);
  const items = useAtomValue(durationTokensAtom);

  return (
    <Box mb="1200" mt="600">
      <TableRoot width="full" maxWidth="full">
        <TableColumnGroup>
          <TableColumn width="18ch" />
          <TableColumn width="3600" />
          <TableColumn />
        </TableColumnGroup>
        <TableHeader>
          <TableRow>
            <TableColumnHeader>Token-Name</TableColumnHeader>
            <TableColumnHeader>Value</TableColumnHeader>
            <TableColumnHeader>
              Demo
              <Button
                size="2xs"
                float="right"
                onPress={() => setSeed(seed + 1)}
                colorPalette="primary"
                variant="solid"
              >
                <Play /> Trigger animations
              </Button>
            </TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} id={item.id}>
              <TableCell>
                <Code variant="subtle">{item.label}</Code>
              </TableCell>
              <TableCell>{item.value.originalValue}</TableCell>
              <TableCell>
                <AnimationDemo
                  key={seed}
                  size="80px"
                  emoji="🐎"
                  duration={item.value.originalValue}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </Box>
  );
};
