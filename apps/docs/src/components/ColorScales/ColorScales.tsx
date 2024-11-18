import { Box, useColorMode, useColorModeValue } from "@bleh-ui/react";
import { themeColorScalesAtom } from "../../atoms/themeColorScales";
import { useAtomValue } from "jotai";
import { JSONTree } from "react-json-tree";

export const ColorScales = () => {
  const themeColorScales = useAtomValue(themeColorScalesAtom);
  const { toggleColorMode } = useColorMode();
  const colorMode = useColorModeValue("light", "dark");
  return (
    <Box>
      <Box asChild color="#808080">
        <button onClick={() => toggleColorMode()}>
          toggle colormode: {colorMode}
        </button>
      </Box>
      <Box bg="bleh.5" color="white">
        My background-color is bleh.5
      </Box>
      <JSONTree data={themeColorScales} />
      <pre>{JSON.stringify(themeColorScales, null, 2)}</pre>
    </Box>
  );
};
