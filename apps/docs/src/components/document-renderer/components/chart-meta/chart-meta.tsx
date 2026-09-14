import { Suspense, type FC } from "react";
import { Box, Flex, Link, Text } from "@commercetools/nimbus";
import * as Icons from "@commercetools/nimbus-icons";

import { useManifest } from "@/contexts/manifest-context";
import { useActiveDoc } from "@/hooks/useActiveDoc";
import {
  CHART_CATALOG,
  ENTRY_BY_EXPORT,
  PURPOSE_BY_KEY,
} from "../charts-home/charts-catalog";

/** Minimal manifest route fields this block reads. */
type MetaRoute = { path: string; title: string; exportName?: string };

/**
 * `<ChartMeta />` — the context block on each chart's doc page. From the active
 * page's `exportName` it looks the chart up in the shared catalog and shows the
 * purpose ("intent") it serves, the question it answers, and cross-links to the
 * sibling charts that serve the same purpose — so a reader who landed on the
 * wrong chart can hop to the right one without going back to the gallery.
 */
const ChartMetaContent: FC = () => {
  const { doc } = useActiveDoc();
  const { routeManifest } = useManifest();

  const exportName = doc?.meta.exportName;
  const entry = exportName ? ENTRY_BY_EXPORT.get(exportName) : undefined;
  const purpose = entry ? PURPOSE_BY_KEY.get(entry.purpose) : undefined;
  if (!entry || !purpose) return null;

  // Sibling charts in the same purpose, mapped to their doc routes.
  const routeByExport = new Map<string, MetaRoute>();
  for (const route of routeManifest?.routes ?? []) {
    const r = route as MetaRoute;
    if (r.exportName) routeByExport.set(r.exportName, r);
  }
  const related = CHART_CATALOG.filter(
    (e) => e.purpose === entry.purpose && e.exportName !== entry.exportName
  )
    .map((e) => routeByExport.get(e.exportName))
    .filter((r): r is MetaRoute => Boolean(r));

  const PurposeIcon =
    (Icons[purpose.icon as keyof typeof Icons] as FC | undefined) ??
    (Icons.Insights as FC);

  return (
    <Box
      my="400"
      p="400"
      bg="neutral.2"
      borderRadius="300"
      border="solid-25"
      borderColor="neutral.3"
    >
      <Flex align="center" gap="200" wrap="wrap">
        <Box color="primary.11" textStyle="lg" display="flex">
          <PurposeIcon />
        </Box>
        <Text textStyle="sm" fontWeight="600" color="neutral.12">
          {purpose.label}
        </Text>
        <Text textStyle="sm" color="neutral.11">
          · {entry.question}
        </Text>
      </Flex>

      {related.length > 0 && (
        <Flex gap="200" wrap="wrap" align="center" mt="300">
          <Text textStyle="xs" color="neutral.10">
            Related charts:
          </Text>
          {related.map((r) => (
            <Text key={r.path} textStyle="xs" color="neutral.11">
              <Link href={r.path}>{r.title}</Link>
            </Text>
          ))}
        </Flex>
      )}
    </Box>
  );
};

export const ChartMeta: FC = () => (
  <Suspense fallback={null}>
    <ChartMetaContent />
  </Suspense>
);
