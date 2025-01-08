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
import CubicBezier from "./cubic-bezier";
import AnimationDemo from "./animation-demo";
import { useState } from "react";
import { Play } from "@bleh-ui/icons";

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
      <TableRoot width="full" maxWidth="full">
        <TableColumnGroup>
          <TableColumn width="18ch" />
          <TableColumn width="36" />
          <TableColumn />
        </TableColumnGroup>
        <TableHeader>
          <TableRow>
            <TableColumnHeader>Token-Name</TableColumnHeader>
            <TableColumnHeader>Curve</TableColumnHeader>
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
              <TableCell>
                <CubicBezier size="80px" bezier={item.value.originalValue} />
              </TableCell>
              <TableCell>
                <AnimationDemo
                  key={seed}
                  size="80px"
                  curve={item.value.originalValue}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </Box>
  );
};
