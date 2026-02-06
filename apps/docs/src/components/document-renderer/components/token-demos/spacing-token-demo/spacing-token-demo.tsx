import { Box, DataTable, Flex, Code } from "@commercetools/nimbus";
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

  const columns = [
    {
      id: "token",
      header: "Token",
      accessor: (row: (typeof spacingTokens)[0]) => row.label,
      width: 120,
      render: ({ value }: { value: string }) => (
        <Code variant="subtle">{value}</Code>
      ),
    },
    {
      id: "value",
      header: "Value",
      accessor: (row: (typeof spacingTokens)[0]) => row.value.originalValue,
      width: 150,
      render: ({ value }: { value: string }) => (
        <Box
          onClick={() => setShowPx(!showPx)}
          cursor="pointer"
          textAlign="right"
        >
          {formatterFn(value)}
        </Box>
      ),
    },
    {
      id: "demo",
      header: "Demo",
      accessor: (row: (typeof spacingTokens)[0]) => row.value.originalValue,
      render: ({ value }: { value: string }) => (
        <Box cursor="pointer" onClick={() => setDemoAltLook(!demoAltLook)}>
          <Flex>
            {demoAltLook && <Box flexGrow="1" height="400" bg="primary.3" />}
            <Box width={value} height="400" bg="primary.9" />
            <Box flexGrow="1" height="400" bg="primary.3" />
          </Flex>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <DataTable columns={columns} rows={spacingTokens} />
    </Box>
  );
};
