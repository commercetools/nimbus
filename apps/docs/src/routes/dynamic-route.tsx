/**
 * Dynamic Route Component
 *
 * Handles all routes dynamically based on the route manifest from MDX files.
 * Routes are defined by the menu property in MDX frontmatter, not hardcoded.
 */

import { Suspense } from "react";
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
import { normalizeRoute } from "@/utils/normalize-route";

export default function DynamicRoute() {
  const location = useLocation();
  const { manifest, isLoading } = useManifest();
  const currentPath = normalizeRoute(location.pathname);

  if (isLoading || !manifest) {
    return <LoadingSpinner />;
  }

  // Special case: home route
  if (currentPath === "home" || currentPath === "") {
    // Check if there's a home document in the manifest
    const homeRoute = manifest.routes.find(
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

          {manifest.categories && manifest.categories.length > 0 && (
            <Stack gap="600">
              {manifest.categories.map((category) => (
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
  const routePath = `/${currentPath}`;
  const route = manifest.routes.find((r) => r.path === routePath);

  if (!route) {
    // Route not found - show 404
    return (
      <Box>
        <Heading as="h1" size="xl" mb="400">
          Page Not Found
        </Heading>
        <Text mb="400">
          The page "{currentPath}" could not be found in the documentation.
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
