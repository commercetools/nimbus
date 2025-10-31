/**
 * Dynamic Route Component
 *
 * Handles all routes dynamically based on the route manifest from MDX files.
 * Routes are defined by the menu property in MDX frontmatter, not hardcoded.
 */

import { Suspense, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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

export default function DynamicRoute() {
  const location = useLocation();
  const { routeManifest, isLoading } = useManifest();
  const { baseRoute, normalizedPath } = useRouteInfo();
  const [isRouteChecked, setIsRouteChecked] = useState(false);

  // Reset route check state when location changes
  useEffect(() => {
    setIsRouteChecked(false);
    // Give the manifest a moment to stabilize before checking route
    const timer = setTimeout(() => {
      setIsRouteChecked(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Show loading while manifest is loading or route hasn't been checked yet
  if (isLoading || !routeManifest || !isRouteChecked) {
    return <LoadingSpinner />;
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
            <Text color="fg.muted" fontSize="lg">
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
