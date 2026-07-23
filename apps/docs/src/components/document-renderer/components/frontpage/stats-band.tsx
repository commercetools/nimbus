import { useAtomValue } from "jotai";
import * as icons from "@commercetools/nimbus-icons";
import { Box, Flex, Heading, Text } from "@commercetools/nimbus";
import { useManifest } from "@/contexts/manifest-context";
import { nimbusPackageVersionAtom } from "@/atoms/nimbus-version";

/**
 * Total number of exported icon components. Derived once from the icon module —
 * the same source of truth the `/icons` page counts (`Object.keys(icons)`).
 */
const ICON_COUNT = Object.keys(icons).length;

/**
 * At-a-glance figures for the home page.
 *
 * Every number is derived at runtime — route-manifest category counts, the icon
 * module, and the package-version atom — so the band stays accurate as the
 * library grows. While the manifest is still loading, manifest-derived counts
 * render a neutral placeholder instead of shifting layout.
 */
export const StatsBand = () => {
  const { routeManifest } = useManifest();
  const version = useAtomValue(nimbusPackageVersionAtom);

  const countFor = (label: string) =>
    routeManifest?.categories.find((c) => c.label === label)?.items.length ?? 0;

  const stats: Array<{ label: string; value: string }> = [
    {
      label: "Components",
      value: routeManifest ? String(countFor("Components")) : "—",
    },
    { label: "Icons", value: ICON_COUNT.toLocaleString() },
    {
      label: "Patterns",
      value: routeManifest ? String(countFor("Patterns")) : "—",
    },
    { label: "Hooks", value: routeManifest ? String(countFor("Hooks")) : "—" },
    { label: "Version", value: `v${version}` },
  ];

  return (
    <Flex
      as="section"
      role="list"
      aria-label="Nimbus at a glance"
      wrap="wrap"
      gap="400"
    >
      {stats.map((stat) => (
        <Box
          key={stat.label}
          role="listitem"
          flex="1 1 0"
          minWidth="8rem"
          borderRadius="200"
          border="solid-25"
          borderColor="neutral.4"
          bg="neutral.2"
          px="600"
          py="400"
        >
          <Heading size="2xl" color="neutral.12">
            {stat.value}
          </Heading>
          <Text
            fontSize="xs"
            fontWeight="600"
            color="neutral.11"
            textTransform="uppercase"
            letterSpacing=".04em"
            whiteSpace="nowrap"
          >
            {stat.label}
          </Text>
        </Box>
      ))}
    </Flex>
  );
};
