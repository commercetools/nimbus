import { Box, Stack, Text, Icon } from "@commercetools/nimbus";
import { Check } from "@commercetools/nimbus-icons";
import { Link } from "../../base-tags";

/**
 * Banner indicating that the component supports Chakra UI style props
 */
export const StylePropsSupportBanner = () => {
  return (
    <Box mb="600" colorPalette="positive" borderRadius="200">
      <Stack direction="row">
        <Icon
          as={Check}
          color="colorPalette.9"
          boxSize="1.25em"
          position="relative"
          top=".0675em"
        />
        <Box colorPalette="neutral">
          <Text fontSize="400" fontWeight="600">
            {" "}
            Style Props Supported
          </Text>
          <Text fontSize="350" mt="100" color="colorPalette.11">
            This component accepts{" "}
            <Link href="/home/style-props">style props</Link>{" "}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
};
