import { Box, Code, Flex, SimpleGrid } from "@commercetools/nimbus";
import { atom, useAtomValue } from "jotai";
import { system } from "@commercetools/nimbus";

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

const AnimationItem = ({
  item,
}: {
  item: {
    id: string;
    label: string;
    value: string;
  };
}) => {
  return (
    <Flex
      direction="column"
      border="solid-25"
      borderColor="neutral.6"
      p="400"
      className="group"
      alignItems="center"
      ml="-1px"
      mt="-1px"
    >
      <Box mb="400" width="1200" height="1200">
        <Box
          width="1200"
          height="1200"
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
