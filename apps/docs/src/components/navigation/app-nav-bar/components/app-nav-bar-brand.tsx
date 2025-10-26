import { Box, Text, Stack, Badge, Link, Icon } from "@commercetools/nimbus";
import { useAtomValue } from "jotai";

import { brandNameAtom } from "@/atoms/brand.ts";
import { nimbusPackageVersionAtom } from "@/atoms/nimbus-version";
import {
  /* Architecture,
  Book,
  CloudQueue, */
  FilterDrama,
  /* MenuBook,
  Palette,
  WbCloudy,
  Widgets, */
} from "@commercetools/nimbus-icons";

/**
 * Component for the brand section of the app navigation bar.
 * Displays the "Nimbus" brand name and allows navigation to home.
 * Shows a home icon when on the /home route.
 */
export const AppNavBarBrand = () => {
  const brandName = useAtomValue(brandNameAtom);
  const nimbusPackageVersion = useAtomValue(nimbusPackageVersionAtom);

  return (
    <Box cursor="pointer" py="200">
      <Stack direction="row" gap="400" alignItems="center">
        <Text
          textStyle="2xl"
          fontWeight="700"
          display="inline-flex"
          alignItems="center"
        >
          <Link href="home" textDecoration="none" color="primary.9">
            <Icon as={FilterDrama} mr="100" /> {brandName}
          </Link>
        </Text>
        <Badge size="2xs" colorPalette="primary">
          v{nimbusPackageVersion}
        </Badge>
      </Stack>
    </Box>
  );
};
