import { Box, Flex, Text } from "@bleh-ui/react";
import { useEffect, useState } from "react";
import take from "lodash/take";

export const IconSearch = () => {
  const [icons, setIcons] = useState(null);
  const [busy, setBusy] = useState(true);
  useEffect(() => {
    const fetchIcons = async () => {
      const data = await import("@bleh-ui/icons");
      setIcons(data.icons);
      setBusy(false);
    };

    fetchIcons();
  }, []);

  if (busy) {
    return <Text>Loading</Text>;
  }

  return (
    <Box>
      <Text>{Object.keys(icons).length} icons:</Text>
      <Flex wrap="wrap">
        {take(Object.keys(icons), 1535).map((iconId) => {
          const Component = icons[iconId];
          return (
            <Box
              key={iconId}
              p="4"
              border="1px solid"
              borderColor="neutral.6"
              ml="-1px"
              mb="-1px"
            >
              <Text textStyle="3xl" color="neutral.11">
                <Component size="1em" />
              </Text>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
};
