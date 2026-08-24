/**
 * Visual comparison view — three panels side by side:
 * 1. UIKit rendered (before)
 * 2. Published MCP migration output
 * 3. Local MCP migration output
 *
 * Uses nested Nimbus Splitters for draggable resizing.
 */

import React, { useState, Suspense } from "react";
import { IntlProvider } from "react-intl";
import {
  NimbusProvider,
  Splitter,
  Text,
  Stack,
  Box,
} from "@commercetools/nimbus";

// ---------------------------------------------------------------------------
// Lazy fixture loading
// ---------------------------------------------------------------------------

const uikitFixtures = {
  "product-list-view": {
    label: "Product List",
    component: React.lazy(() =>
      import("../fixtures/uikit/product-list-view.js").then((m) => ({
        default: m.ProductListView,
      }))
    ),
  },
  "product-detail-form": {
    label: "Product Detail",
    component: React.lazy(() =>
      import("../fixtures/uikit/product-detail-form.js").then((m) => ({
        default: m.ProductDetailForm,
      }))
    ),
  },
} as const;

type FixtureKey = keyof typeof uikitFixtures;

// ---------------------------------------------------------------------------
// Types for MCP comparison data (from eval-results.json)
// ---------------------------------------------------------------------------

interface McpComparison {
  label: string;
  tool: string;
  args: Record<string, unknown>;
  local: Record<string, unknown>;
  published: Record<string, unknown>;
  addedFields: string[];
  removedFields: string[];
  changedFields: string[];
}

// ---------------------------------------------------------------------------
// Error boundary
// ---------------------------------------------------------------------------

function ErrorFallback({ name, error }: { name: string; error: string }) {
  return (
    <Box p="400" bg="critical.2" borderRadius="200">
      <Text fontWeight="bold">{name} failed to render:</Text>
      <Text textStyle="body-small" color="neutral.11">
        {error}
      </Text>
    </Box>
  );
}

class RenderBoundary extends React.Component<
  { name: string; children: React.ReactNode },
  { error: string | null }
> {
  state = { error: null as string | null };

  static getDerivedStateFromError(error: Error) {
    return { error: error.message };
  }

  render() {
    if (this.state.error) {
      return <ErrorFallback name={this.props.name} error={this.state.error} />;
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// MCP response panel
// ---------------------------------------------------------------------------

function McpResponsePanel({
  data,
  otherData,
  label,
  accentColor,
}: {
  data: Record<string, unknown> | null;
  otherData: Record<string, unknown> | null;
  label: string;
  accentColor: string;
}) {
  if (!data) {
    return (
      <Box p="400">
        <Text color="neutral.9" textStyle="body-small">
          {label} not available. Install published MCP to enable comparison.
        </Text>
      </Box>
    );
  }

  // Determine which fields are unique, changed, or same compared to other
  const otherKeys = otherData
    ? new Set(Object.keys(otherData))
    : new Set<string>();
  const allKeys = Object.keys(data);

  return (
    <Box p="300" fontSize="xs" fontFamily="mono">
      {allKeys.map((key) => {
        const val = data[key];
        const inOther = otherKeys.has(key);
        const same =
          inOther && JSON.stringify(val) === JSON.stringify(otherData![key]);

        let fieldColor = "neutral.11"; // default
        if (!inOther && otherData)
          fieldColor = "success.11"; // only in this version
        else if (!same && otherData) fieldColor = "warning.11"; // changed

        const displayVal =
          typeof val === "string"
            ? val.length > 200
              ? val.slice(0, 200) + "…"
              : val
            : Array.isArray(val)
              ? `[${val.length} items]`
              : typeof val === "object" && val !== null
                ? `{${Object.keys(val).length} keys}`
                : String(val);

        return (
          <Box
            key={key}
            py="100"
            borderBottomWidth="25"
            borderColor="neutral.4"
          >
            <Text fontWeight="bold" color={fieldColor}>
              {key}
              {!inOther && otherData && (
                <Text as="span" color="success.9" fontWeight="normal">
                  {" "}
                  (new)
                </Text>
              )}
              {!same && inOther && (
                <Text as="span" color="warning.9" fontWeight="normal">
                  {" "}
                  (changed)
                </Text>
              )}
            </Text>
            <Text color="neutral.9" wordBreak="break-all">
              {displayVal}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Panel header bar
// ---------------------------------------------------------------------------

function PanelHeader({
  label,
  bg,
  borderColor,
  color,
}: {
  label: string;
  bg: string;
  borderColor: string;
  color: string;
}) {
  return (
    <Box
      px="400"
      py="200"
      bg={bg}
      borderBottomWidth="25"
      borderColor={borderColor}
      position="sticky"
      top="0"
      zIndex="1"
    >
      <Text fontWeight="bold" color={color} textStyle="body-small">
        {label}
      </Text>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface FileMigrationResult {
  fixture: string;
  mappings: Record<string, unknown>[];
  unmapped: Array<{ name: string }>;
  layoutGuidance?: string;
  coverage: number;
  stylePropsCount: number;
}

export function VisualCompare({
  comparisons,
  localFileMigrations,
}: {
  comparisons: McpComparison[] | null;
  localFileMigrations?: FileMigrationResult[];
}) {
  const [selected, setSelected] = useState<FixtureKey>("product-list-view");
  const fixture = uikitFixtures[selected];

  // Find the matching file-level comparison for the selected fixture
  const fileComparison = comparisons?.find(
    (c) => c.tool === "migrate_from_uikit" && c.label.includes(selected)
  );

  // Fall back to local-only data from the migration dimension when no A/B comparison
  const localMigration = localFileMigrations?.find(
    (f) => selected.includes(f.fixture) || f.fixture.includes(selected)
  );
  const localData: Record<string, unknown> | null =
    fileComparison?.local ??
    (localMigration
      ? {
          filePath: `fixtures/uikit/${selected}.tsx`,
          mappings: localMigration.mappings,
          unmapped: localMigration.unmapped,
          layoutGuidance: localMigration.layoutGuidance,
        }
      : null);
  const publishedData: Record<string, unknown> | null =
    fileComparison?.published ?? null;

  return (
    <NimbusProvider>
      <Stack gap="400">
        {/* Fixture selector */}
        <Stack direction="row" gap="200">
          {(Object.keys(uikitFixtures) as FixtureKey[]).map((key) => (
            <Box
              key={key}
              as="button"
              onClick={() => setSelected(key)}
              px="400"
              py="200"
              borderRadius="200"
              cursor="pointer"
              fontWeight="medium"
              fontSize="sm"
              bg={key === selected ? "neutral.4" : "transparent"}
              color={key === selected ? "neutral.12" : "neutral.9"}
              borderWidth="25"
              borderColor={key === selected ? "neutral.6" : "transparent"}
            >
              {uikitFixtures[key].label}
            </Box>
          ))}
          {!comparisons && (
            <Box px="400" py="200" fontSize="xs" color="neutral.8">
              Published MCP not installed — middle panel will be empty
            </Box>
          )}
        </Stack>

        {/* Three-panel comparison */}
        <Box
          h="85vh"
          borderWidth="25"
          borderColor="neutral.6"
          borderRadius="200"
          overflow="hidden"
        >
          <Splitter.Root defaultSize={35} minSize={15} maxSize={60}>
            {/* Panel 1: UIKit rendered */}
            <Splitter.Aside>
              <Box h="100%" overflow="auto" bg="white">
                <PanelHeader
                  label="● UI KIT — rendered (before)"
                  bg="warning.3"
                  borderColor="warning.6"
                  color="warning.11"
                />
                <Box p="400">
                  <IntlProvider locale="en">
                    <RenderBoundary name="UIKit">
                      <Suspense
                        fallback={
                          <Box p="600">
                            <Text color="neutral.9">Loading UIKit…</Text>
                          </Box>
                        }
                      >
                        <fixture.component />
                      </Suspense>
                    </RenderBoundary>
                  </IntlProvider>
                </Box>
              </Box>
            </Splitter.Aside>
            <Splitter.Handle />
            {/* Panels 2+3: Published and Local MCP output */}
            <Splitter.Main>
              <Splitter.Root defaultSize={50} minSize={20} maxSize={80}>
                {/* Panel 2: Published MCP */}
                <Splitter.Aside>
                  <Box h="100%" overflow="auto" bg="neutral.1">
                    <PanelHeader
                      label="● PUBLISHED MCP — migration output"
                      bg="neutral.3"
                      borderColor="neutral.6"
                      color="neutral.11"
                    />
                    <McpResponsePanel
                      data={publishedData}
                      otherData={localData}
                      label="Published MCP"
                      accentColor="neutral"
                    />
                  </Box>
                </Splitter.Aside>
                <Splitter.Handle />
                {/* Panel 3: Local MCP */}
                <Splitter.Main>
                  <Box h="100%" overflow="auto" bg="neutral.1">
                    <PanelHeader
                      label="● LOCAL MCP — migration output"
                      bg="info.3"
                      borderColor="info.6"
                      color="info.11"
                    />
                    <McpResponsePanel
                      data={localData}
                      otherData={publishedData}
                      label="Local MCP"
                      accentColor="info"
                    />
                  </Box>
                </Splitter.Main>
              </Splitter.Root>
            </Splitter.Main>
          </Splitter.Root>
        </Box>

        {/* Diff summary */}
        {fileComparison && (
          <Stack direction="row" gap="300" px="200">
            {fileComparison.addedFields.length > 0 && (
              <Text textStyle="body-small" color="success.11">
                ✅ New in local: {fileComparison.addedFields.join(", ")}
              </Text>
            )}
            {fileComparison.changedFields.length > 0 && (
              <Text textStyle="body-small" color="warning.11">
                ∆ Changed: {fileComparison.changedFields.join(", ")}
              </Text>
            )}
            {fileComparison.removedFields.length > 0 && (
              <Text textStyle="body-small" color="critical.11">
                ❌ Removed: {fileComparison.removedFields.join(", ")}
              </Text>
            )}
            {fileComparison.addedFields.length === 0 &&
              fileComparison.changedFields.length === 0 &&
              fileComparison.removedFields.length === 0 && (
                <Text textStyle="body-small" color="neutral.9">
                  Responses identical
                </Text>
              )}
          </Stack>
        )}
      </Stack>
    </NimbusProvider>
  );
}
