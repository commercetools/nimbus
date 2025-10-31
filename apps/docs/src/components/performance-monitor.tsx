/**
 * Performance Monitor
 *
 * Tracks and displays performance metrics in development mode.
 * Measures route transitions, component render times, and resource loading.
 */

import { useEffect, useState } from "react";
import { Box, Stack, Text, Badge } from "@commercetools/nimbus";

interface PerformanceMetrics {
  routeTransition: number;
  domContentLoaded: number;
  fullyLoaded: number;
  resourceCount: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
}

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    routeTransition: 0,
    domContentLoaded: 0,
    fullyLoaded: 0,
    resourceCount: 0,
  });

  useEffect(() => {
    // Collect performance metrics
    const collectMetrics = () => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        const domContentLoaded =
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart;
        const fullyLoaded = navigation.loadEventEnd - navigation.loadEventStart;

        const resources = performance.getEntriesByType("resource");

        setMetrics({
          routeTransition: 0, // Will be updated on route changes
          domContentLoaded,
          fullyLoaded,
          resourceCount: resources.length,
        });
      }

      // Web Vitals (if available)
      if ("PerformanceObserver" in window) {
        try {
          // Largest Contentful Paint
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[
              entries.length - 1
            ] as PerformanceEntry & {
              renderTime?: number;
              loadTime?: number;
            };
            if (lastEntry) {
              setMetrics((prev) => ({
                ...prev,
                largestContentfulPaint:
                  lastEntry.renderTime || lastEntry.loadTime,
              }));
            }
          });
          lcpObserver.observe({
            type: "largest-contentful-paint",
            buffered: true,
          });

          // First Input Delay
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(
              (entry: PerformanceEntry & { processingStart?: number }) => {
                if (entry.processingStart) {
                  setMetrics((prev) => ({
                    ...prev,
                    firstInputDelay: entry.processingStart - entry.startTime,
                  }));
                }
              }
            );
          });
          fidObserver.observe({ type: "first-input", buffered: true });

          // Cumulative Layout Shift
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(
              (
                entry: PerformanceEntry & {
                  hadRecentInput?: boolean;
                  value?: number;
                }
              ) => {
                if (!entry.hadRecentInput) {
                  clsValue += entry.value ?? 0;
                  setMetrics((prev) => ({
                    ...prev,
                    cumulativeLayoutShift: clsValue,
                  }));
                }
              }
            );
          });
          clsObserver.observe({ type: "layout-shift", buffered: true });
        } catch (error) {
          console.warn("Performance observers not fully supported", error);
        }
      }
    };

    // Collect metrics after page load
    if (document.readyState === "complete") {
      collectMetrics();
    } else {
      window.addEventListener("load", collectMetrics);
    }

    return () => {
      window.removeEventListener("load", collectMetrics);
    };
  }, []);

  // Only show in development
  if (import.meta.env.PROD) return null;

  const formatMs = (ms: number) => {
    return ms > 0 ? `${ms.toFixed(0)}ms` : "N/A";
  };

  const getColorForMetric = (value: number, threshold: number): string => {
    if (value === 0) return "neutral";
    return value < threshold
      ? "positive"
      : value < threshold * 1.5
        ? "warning"
        : "critical";
  };

  return (
    <Box p="400" bg="neutral.2" borderRadius="200">
      <Stack direction="column" gap="300">
        <Text fontWeight="600" fontSize="400">
          ⚡ Performance Metrics
        </Text>

        <Stack direction="row" gap="400" wrap="wrap">
          {/* DOM Content Loaded */}
          <Stack direction="column" gap="100">
            <Text fontSize="300" color="neutral.11">
              DOM Ready
            </Text>
            <Badge
              colorPalette={getColorForMetric(metrics.domContentLoaded, 1000)}
              size="sm"
            >
              {formatMs(metrics.domContentLoaded)}
            </Badge>
          </Stack>

          {/* Fully Loaded */}
          <Stack direction="column" gap="100">
            <Text fontSize="300" color="neutral.11">
              Fully Loaded
            </Text>
            <Badge
              colorPalette={getColorForMetric(metrics.fullyLoaded, 2000)}
              size="sm"
            >
              {formatMs(metrics.fullyLoaded)}
            </Badge>
          </Stack>

          {/* LCP */}
          {metrics.largestContentfulPaint !== undefined && (
            <Stack direction="column" gap="100">
              <Text fontSize="300" color="neutral.11">
                LCP
              </Text>
              <Badge
                colorPalette={getColorForMetric(
                  metrics.largestContentfulPaint,
                  2500
                )}
                size="sm"
              >
                {formatMs(metrics.largestContentfulPaint)}
              </Badge>
            </Stack>
          )}

          {/* FID */}
          {metrics.firstInputDelay !== undefined && (
            <Stack direction="column" gap="100">
              <Text fontSize="300" color="neutral.11">
                FID
              </Text>
              <Badge
                colorPalette={getColorForMetric(metrics.firstInputDelay, 100)}
                size="sm"
              >
                {formatMs(metrics.firstInputDelay)}
              </Badge>
            </Stack>
          )}

          {/* CLS */}
          {metrics.cumulativeLayoutShift !== undefined && (
            <Stack direction="column" gap="100">
              <Text fontSize="300" color="neutral.11">
                CLS
              </Text>
              <Badge
                colorPalette={
                  metrics.cumulativeLayoutShift < 0.1
                    ? "positive"
                    : metrics.cumulativeLayoutShift < 0.25
                      ? "warning"
                      : "critical"
                }
                size="sm"
              >
                {metrics.cumulativeLayoutShift.toFixed(3)}
              </Badge>
            </Stack>
          )}

          {/* Resource Count */}
          <Stack direction="column" gap="100">
            <Text fontSize="300" color="neutral.11">
              Resources
            </Text>
            <Badge colorPalette="info" size="sm">
              {metrics.resourceCount}
            </Badge>
          </Stack>
        </Stack>

        <Text fontSize="250" color="neutral.10">
          Target: LCP &lt; 2.5s, FID &lt; 100ms, CLS &lt; 0.1
        </Text>
      </Stack>
    </Box>
  );
};
