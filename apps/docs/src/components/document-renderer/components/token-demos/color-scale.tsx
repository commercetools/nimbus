import { Box, Flex, Stack, Text } from "@commercetools/nimbus";
import { useAtomValue } from "jotai";
import { themeColorScalesAtom } from "@/atoms/theme-color-scales.ts";
import { useMemo } from "react";
import last from "lodash/last";
import compact from "lodash/compact";

export const ColorScale = (props: { id: string }) => {
  const { id } = props;
  const themeColorScales = useAtomValue(themeColorScalesAtom);

  const colors = useMemo(() => {
    if (!themeColorScales) return [];
    return compact([
      themeColorScales.get(`${id}.1`),
      themeColorScales.get(`${id}.2`),
      themeColorScales.get(`${id}.3`),
      themeColorScales.get(`${id}.4`),
      themeColorScales.get(`${id}.5`),
      themeColorScales.get(`${id}.6`),
      themeColorScales.get(`${id}.7`),
      themeColorScales.get(`${id}.8`),
      themeColorScales.get(`${id}.9`),
      themeColorScales.get(`${id}.10`),
      themeColorScales.get(`${id}.11`),
      themeColorScales.get(`${id}.12`),
    ]);
  }, [themeColorScales, id]);

  if (!colors) return null;

  return (
    <Stack className="group">
      <div>
        <Text
          fontWeight="600"
          fontFamily="mono"
          bg={id}
          px="200"
          py="100"
          display="inline-block"
          color={`${id}.contrast`}
        >
          {id}
        </Text>
      </div>
      <Flex width="full" grow="1" gap="100">
        {colors.map((color) => (
          <Box
            as="a"
            flexBasis="1"
            flexGrow="1"
            flexShrink="1"
            key={color.name}
            border="1px solid"
            borderColor={`neutral.6`}
          >
            <Box aspectRatio={1} bg={color?.name.split("colors.").join("")}>
              <Text
                bg="black"
                color="white"
                width="2ch"
                textAlign="center"
                fontWeight="600"
                display="none"
                _groupHover={{ display: "block" }}
              >
                {last(color.path)}
              </Text>
            </Box>
          </Box>
        ))}
      </Flex>
    </Stack>
  );
};
