import { activeRouteAtom } from "@/atoms/route.ts";
import { Box, Text, Stack, Badge } from "@commercetools/nimbus";
import { useAtom, useAtomValue } from "jotai";
import { MouseEvent } from "react";
import { brandNameAtom } from "@/atoms/brand.ts";
import { nimbusPackageVersionAtom } from "@/atoms/nimbus-version";

/**
 * Component for the brand section of the app navigation bar.
 * Displays the "Nimbus" brand name and allows navigation to home.
 */
export const AppNavBarBrand = () => {
  const [, setActiveRoute] = useAtom(activeRouteAtom);
  const brandName = useAtomValue(brandNameAtom);
  const nimbusPackageVersion = useAtomValue(nimbusPackageVersionAtom);

  /**
   * Handles click events on the brand name span to navigate home.
   * @param e - The mouse event.
   */
  const handleHomeRequest = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setActiveRoute("home");
  };

  return (
    <Box pt="200" pb="200" cursor="pointer">
      <Stack direction="row" gap="400" alignItems="center">
        <Text
          textStyle="2xl"
          asChild
          fontWeight="700"
          onClick={handleHomeRequest}
        >
          <a href="/home">{brandName}</a>
        </Text>
        <Badge size="2xs" colorPalette="primary">
          v{nimbusPackageVersion}
        </Badge>
      </Stack>
    </Box>
  );
};
