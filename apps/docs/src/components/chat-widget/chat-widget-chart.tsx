import { Component, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Box,
  Button,
  Flex,
  Menu,
  Separator,
  Text,
  useColorMode,
} from "@commercetools/nimbus";
import { SwapHoriz } from "@commercetools/nimbus-icons";
import {
  ChartThemeProvider,
  ResolvedChart,
  ResponsiveContainer,
  renderFallbackTable,
  resolveByName,
} from "@commercetools/nimbus-viz";
import type { ResolveRequest } from "@commercetools/nimbus-viz";
import type { ResolvedChatChart } from "./types";
import { chartAlternateLabel, getAlternateCharts } from "./chart-alternates";

const AUTO_KEY = "__auto__";

function toResolveRequest(chart: ResolvedChatChart): ResolveRequest {
  return {
    intent: chart.intent,
    data: chart.data,
    options: chart.options,
  };
}

/**
 * Local mirror of nimbus-viz's private `ChartErrorBoundary`
 * (packages/nimbus-viz/src/selection/resolved-chart.tsx) — needed because
 * that class isn't part of the public surface, and bypassing `<ResolvedChart>`
 * for the alternate-chart branch below would otherwise lose the "a throwing
 * chart degrades to the table, never blanks the surface" guarantee. Resets
 * itself when `children` changes so picking a different alternate always gets
 * a fresh render attempt rather than staying stuck in the failed state.
 */
class ChartAlternateBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: { children: ReactNode }) {
    if (this.state.hasError && prevProps.children !== this.props.children) {
      this.setState({ hasError: false });
    }
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export function ChatWidgetChart({ chart }: { chart: ResolvedChatChart }) {
  const { colorMode } = useColorMode();
  const mode = colorMode === "dark" ? "dark" : "light";

  // null = "use nimbus-viz's own auto-resolved default via <ResolvedChart>".
  // Component-local, no persistence — matches this widget's existing scope
  // decision (one message = one mounted instance = one piece of state).
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const request = useMemo(() => toResolveRequest(chart), [chart]);
  const alternates = useMemo(
    () => getAlternateCharts(chart.kind),
    [chart.kind]
  );
  const showPicker = alternates.length > 1;

  const errorFallback = useMemo(
    () =>
      renderFallbackTable(
        request.data,
        "The selected chart failed to render; showing the data as a table."
      ),
    [request.data]
  );

  return (
    // Explicit width is required, not cosmetic — ChatMessage.Body is
    // `width: fit-content` with `alignItems: "flex-start"`, so a flex item
    // with no explicit width here gets its OWN auto/fit-content size, and
    // this box's only content is a chain of `width: 100%` descendants
    // (ResponsiveContainer -> visx's ParentSize). Without width="full" the
    // whole chain collapses to 0 and the chart silently renders nothing.
    <Box mt="200" width="full">
      {showPicker && (
        <Flex justifyContent="flex-end" mb="100">
          <Menu.Root
            selectionMode="single"
            selectedKeys={new Set([selectedName ?? AUTO_KEY])}
            onSelectionChange={(keys) => {
              if (keys === "all") return;
              const next = Array.from(keys)[0] as string | undefined;
              setSelectedName(!next || next === AUTO_KEY ? null : next);
            }}
          >
            <Menu.Trigger asChild>
              <Button size="2xs" variant="ghost" colorPalette="neutral">
                <SwapHoriz />
                Chart type
              </Button>
            </Menu.Trigger>
            <Menu.Content>
              <Menu.Item id={AUTO_KEY}>
                <Text slot="label">Automatic</Text>
                <Text slot="description">
                  nimbus-viz's recommended chart for this data
                </Text>
              </Menu.Item>
              <Separator />
              {alternates.map((entry) => (
                <Menu.Item key={entry.metadata.name} id={entry.metadata.name}>
                  <Text slot="label">{chartAlternateLabel(entry)}</Text>
                  <Text slot="description">
                    {entry.metadata.questionString}
                  </Text>
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Root>
        </Flex>
      )}
      <ChartThemeProvider mode={mode}>
        <ResponsiveContainer height={220}>
          {(width, height) => (
            <ChartAlternateBoundary fallback={errorFallback}>
              {selectedName ? (
                resolveByName(selectedName, request, { width, height }).render({
                  width,
                  height,
                })
              ) : (
                <ResolvedChart
                  request={request}
                  width={width}
                  height={height}
                />
              )}
            </ChartAlternateBoundary>
          )}
        </ResponsiveContainer>
      </ChartThemeProvider>
    </Box>
  );
}
