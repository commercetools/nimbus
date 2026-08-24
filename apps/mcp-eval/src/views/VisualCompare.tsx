/**
 * Visual comparison view — two panels side by side:
 * 1. UIKit rendered (before migration)
 * 2. Nimbus rendered (after migration using local MCP guidance)
 *
 * Uses Nimbus Splitter with a draggable handle for resizing.
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
// Fixture pairs — UIKit (before) and Nimbus (after)
// ---------------------------------------------------------------------------

const fixtures = {
  "product-list-view": {
    label: "Product List",
    uikit: React.lazy(() =>
      import("../fixtures/uikit/product-list-view.js").then((m) => ({
        default: m.ProductListView,
      }))
    ),
    nimbus: React.lazy(() =>
      import("../fixtures/nimbus/product-list-view.js").then((m) => ({
        default: m.ProductListView,
      }))
    ),
  },
  "product-detail-form": {
    label: "Product Detail",
    uikit: React.lazy(() =>
      import("../fixtures/uikit/product-detail-form.js").then((m) => ({
        default: m.ProductDetailForm,
      }))
    ),
    nimbus: React.lazy(() =>
      import("../fixtures/nimbus/product-detail-form.js").then((m) => ({
        default: m.ProductDetailForm,
      }))
    ),
  },
} as const;

type FixtureKey = keyof typeof fixtures;

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
// Panel header
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

export function VisualCompare() {
  const [selected, setSelected] = useState<FixtureKey>("product-list-view");
  const fixture = fixtures[selected];

  return (
    <NimbusProvider>
      <Stack gap="400">
        {/* Fixture selector */}
        <Stack direction="row" gap="200">
          {(Object.keys(fixtures) as FixtureKey[]).map((key) => (
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
              {fixtures[key].label}
            </Box>
          ))}
        </Stack>

        {/* Two-panel comparison: UIKit (before) | Nimbus (after) */}
        <Box
          h="85vh"
          borderWidth="25"
          borderColor="neutral.6"
          borderRadius="200"
          overflow="hidden"
        >
          <Splitter.Root defaultSize={50} minSize={20} maxSize={80}>
            {/* Left: UIKit rendered */}
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
                        <fixture.uikit />
                      </Suspense>
                    </RenderBoundary>
                  </IntlProvider>
                </Box>
              </Box>
            </Splitter.Aside>
            <Splitter.Handle />
            {/* Right: Nimbus rendered */}
            <Splitter.Main>
              <Box h="100%" overflow="auto" bg="white">
                <PanelHeader
                  label="● NIMBUS — rendered (after migration)"
                  bg="info.3"
                  borderColor="info.6"
                  color="info.11"
                />
                <Box p="400">
                  <RenderBoundary name="Nimbus">
                    <Suspense
                      fallback={
                        <Box p="600">
                          <Text color="neutral.9">Loading Nimbus…</Text>
                        </Box>
                      }
                    >
                      <fixture.nimbus />
                    </Suspense>
                  </RenderBoundary>
                </Box>
              </Box>
            </Splitter.Main>
          </Splitter.Root>
        </Box>
      </Stack>
    </NimbusProvider>
  );
}
