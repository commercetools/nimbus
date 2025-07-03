import { Box, Text, Stack, Badge, Link } from "@commercetools/nimbus";
import { useAtomValue } from "jotai";

import { brandNameAtom } from "@/atoms/brand.ts";
import { nimbusPackageVersionAtom } from "@/atoms/nimbus-version";

/**
 * Component for the brand section of the app navigation bar.
 * Displays the "Nimbus" brand name and allows navigation to home.
 */
export const AppNavBarBrand = () => {
  const brandName = useAtomValue(brandNameAtom);
  const nimbusPackageVersion = useAtomValue(nimbusPackageVersionAtom);

  return (
    <Box pt="200" pb="200" cursor="pointer">
      <Stack direction="row" gap="400" alignItems="center">
        <Text textStyle="2xl" asChild fontWeight="700">
          <Link unstyled href="home">
            {brandName}
          </Link>
        </Text>
        <Badge size="2xs" colorPalette="primary">
          v{nimbusPackageVersion}
        </Badge>
      </Stack>
    </Box>
  );
};
