import { Component, useEffect, useMemo } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { resolve, renderFallbackTable } from "./resolve";
import type { ResolveRequest, ResolveResult } from "./types";

export interface ResolvedChartProps {
  /** The agent's structured intent + data + options. */
  request: ResolveRequest;
  width: number;
  height: number;
  /** Observe the resolver's verdict (chosen chart, rationale, candidates). */
  onResolve?: (result: ResolveResult) => void;
}

/* -------------------------------------------------------------------------- */
/* Error boundary                                                             */
/* -------------------------------------------------------------------------- */

interface BoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}
interface BoundaryState {
  hasError: boolean;
}

/**
 * Catches a throw from the *rendering* of a chosen chart and swaps in the
 * DataTable fallback. `resolve` already guarantees it never throws while
 * SELECTING; this closes the remaining hole the docs/09 finding named — "one
 * throwing chart took down the whole page" — by isolating a chart that throws
 * at React render time (e.g. a bad Sankey config) so it degrades to the table
 * instead of blanking the surface.
 */
class ChartErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo): void {
    // Intentionally swallowed — the fallback is the user-facing signal. A host
    // could forward this to its own error reporting here.
  }

  componentDidUpdate(prev: BoundaryProps): void {
    // Reset so a new request/child gets a fresh attempt after a prior failure.
    if (this.state.hasError && prev.children !== this.props.children) {
      this.setState({ hasError: false });
    }
  }

  render(): ReactNode {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

/* -------------------------------------------------------------------------- */
/* ResolvedChart                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Run the selection engine and render the chosen chart — or the guaranteed
 * DataTable fallback — for a request. This is the demoable surface the gallery
 * uses: hand it an intent + data and it draws the right thing, logging the
 * decision through telemetry and never blanking on bad input.
 *
 * Must be rendered inside a `<ChartThemeProvider>` (like every chart here).
 */
export function ResolvedChart({
  request,
  width,
  height,
  onResolve,
}: ResolvedChartProps) {
  const result = useMemo(
    () => resolve(request, { width, height }),
    [request, width, height]
  );

  useEffect(() => {
    onResolve?.(result);
  }, [result, onResolve]);

  // The same fallback the resolver would produce, used if the chosen chart
  // throws while rendering.
  const errorFallback = useMemo(
    () =>
      renderFallbackTable(
        request.data,
        "The selected chart failed to render; showing the data as a table."
      ),
    [request.data]
  );

  return (
    <ChartErrorBoundary fallback={errorFallback}>
      {result.render({ width, height })}
    </ChartErrorBoundary>
  );
}
