import { Box, Button, Code, DataTable } from "@commercetools/nimbus";

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

  const columns = [
    {
      id: "name",
      header: "Token-Name",
      accessor: (row: (typeof items)[0]) => row.label,
      width: 200,
      render: ({ value }: { value: string }) => (
        <Code variant="subtle">{value}</Code>
      ),
    },
    {
      id: "curve",
      header: "Curve",
      accessor: (row: (typeof items)[0]) => row.value.originalValue,
      width: 250,
      render: ({ value }: { value: string }) => (
        <CubicBezier size="80px" bezier={value} />
      ),
    },
    {
      id: "demo",
      header: (
        <>
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
        </>
      ),
      accessor: (row: (typeof items)[0]) => row.value.originalValue,
      render: ({ value }: { value: string }) => (
        <AnimationDemo key={seed} size="80px" curve={value} />
      ),
    },
  ];

  return (
    <Box mb="1200" mt="600">
      <DataTable columns={columns} rows={items} />
    </Box>
  );
};
