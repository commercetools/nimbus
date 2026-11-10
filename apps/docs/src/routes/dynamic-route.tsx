/**
 * Dynamic Route Component
 *
 * Handles all routes dynamically based on the route manifest from MDX files.
 * Routes are defined by the menu property in MDX frontmatter, not hardcoded.
 */

import { Suspense } from "react";
import { Navigate } from "react-router-dom";
import {
  Box,
  LoadingSpinner,
  Heading,
  Text,
  Link,
  Stack,
} from "@commercetools/nimbus";
import { DocumentRenderer } from "@/components/document-renderer";
import { useManifest } from "@/contexts/manifest-context";
import { useRouteInfo } from "@/hooks/use-route-info";
import { normalizeRoute } from "@/utils/normalize-route";

/**
 * Old links: PascalCase labels used to give one word ("/defaultpage"), now
 * they give separate words ("/default-page"). Comparing without dashes finds
 * the page; a tab suffix such as "/dev" is kept.
 * @returns The current path of the page, or undefined if the path is not an old link
 */
const findMovedPath = (
  routes: { path: string }[],
  normalizedPath: string
): string | undefined => {
  const undashed = (path: string) => path.replace(/-/g, "");
  const wanted = undashed(normalizedPath);

  let best: { path: string; length: number } | undefined;
  for (const route of routes) {
    const current = normalizeRoute(route.path);
    const old = undashed(current);
    if (
      (wanted === old || wanted.startsWith(`${old}/`)) &&
      (!best || old.length > best.length)
    ) {
      best = { path: current, length: old.length };
    }
  }
  if (!best) return undefined;

  const isCurrent =
    normalizedPath === best.path || normalizedPath.startsWith(`${best.path}/`);
  if (isCurrent) return undefined;

  const rest = normalizedPath.split("/").slice(best.path.split("/").length);
  return `/${[best.path, ...rest].join("/")}`;
};

export default function DynamicRoute() {
  const { routeManifest, isLoading } = useManifest();
  const { baseRoute, normalizedPath } = useRouteInfo();

  // Show loading only while the manifest itself is loading.
  if (isLoading || !routeManifest) {
    return <LoadingSpinner />;
  }

  const movedTo = findMovedPath(routeManifest.routes, normalizedPath);
  if (movedTo) {
    return <Navigate to={movedTo} replace />;
  }

  // Special case: home route
  if (baseRoute === "home" || baseRoute === "") {
    // Check if there's a home document in the manifest
    const homeRoute = routeManifest.routes.find(
      (r) => r.path === "/" || r.path === "/home"
    );

    if (homeRoute) {
      // Render home document
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <Box>
            <DocumentRenderer />
          </Box>
        </Suspense>
      );
    }

    // Fallback: Show welcome page with categories
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Stack gap="800">
          <Box>
            <Heading as="h1" size="2xl">
              Nimbus Design System
            </Heading>
            <Text color="fg.subtle" fontSize="lg">
              Build beautiful, accessible interfaces with React
            </Text>
          </Box>

          {routeManifest.categories && routeManifest.categories.length > 0 && (
            <Stack gap="600">
              {routeManifest.categories.map((category) => (
                <Box key={category.id}>
                  <Heading as="h2" size="xl" mb="400">
                    {category.label}
                  </Heading>
                  <Stack gap="200">
                    {category.items.map((item) => (
                      <Link key={item.id} href={item.path}>
                        {item.title}
                      </Link>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      </Suspense>
    );
  }

  // Look up route in manifest
  const routePath = `/${baseRoute}`;
  const route = routeManifest.routes.find((r) => r.path === routePath);

  if (!route) {
    // Route not found - show 404
    return (
      <Box>
        <Heading as="h1" size="xl" mb="400">
          Page Not Found
        </Heading>
        <Text mb="400">
          The page "{normalizedPath}" could not be found in the documentation.
        </Text>
        <Link href="/">Return to Home</Link>
      </Box>
    );
  }

  // Route found - render document
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Box>
        <DocumentRenderer />
      </Box>
    </Suspense>
  );
}
