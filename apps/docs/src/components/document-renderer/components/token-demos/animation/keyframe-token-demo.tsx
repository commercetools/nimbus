import { Box, Code, Flex, SimpleGrid } from "@bleh-ui/react";

import { atom, useAtomValue } from "jotai";
import { system } from "@bleh-ui/react";

import { useState } from "react";

export const keyframeTokensAtom = atom(() => {
  const obj = system._config.theme?.keyframes || {};

  const arr = Object.keys(obj).map((key) => {
    return {
      id: key,
      label: key,
      value: key,
    };
  });
  return arr;
});

const AnimationItem = ({ item }) => {
  return (
    <Flex
      direction="column"
      border="1px solid"
      borderColor="neutral.6"
      p="4"
      className="group"
      alignItems="center"
      ml="-1px"
      mt="-1px"
    >
      <Box mb="4" width="12" height="12">
        <Box
          width="12"
          height="12"
          bg="primary.4"
          animationDuration="1s"
          animationName={item.value}
          animationIterationCount="0"
          animationTimingFunction="linear"
          _groupHover={{
            bg: "primary.9",
            animationIterationCount: "infinite",
          }}
        />
      </Box>
      <Box>
        <Code truncate variant="subtle">
          {item.label}
        </Code>
      </Box>
    </Flex>
  );
};

export const KeyframeTokenDemo = () => {
  const [seed, setSeed] = useState(0);
  const items = useAtomValue(keyframeTokensAtom);

  return (
    <Box>
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }}>
        {items.map((item) => (
          <AnimationItem key={item.id} item={item} />
        ))}
      </SimpleGrid>
    </Box>
  );
};
