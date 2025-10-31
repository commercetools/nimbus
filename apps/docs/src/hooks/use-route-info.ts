import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useManifest } from "@/contexts/manifest-context";
import { normalizeRoute } from "@/utils/normalize-route";

import type { RouteManifest } from "@/contexts/manifest-context";

type RouteInfo = {
  normalizedPath: string;
  baseRoute: string;
  viewKey?: string;
  manifestRoute?: RouteManifest["routes"][number];
};

const findMatchingRoute = (
  normalizedPath: string,
  manifest?: RouteManifest | null
) => {
  if (!manifest) {
    return undefined;
  }

  let matchedRoute: RouteManifest["routes"][number] | undefined;
  let longestMatchLength = -1;

  for (const route of manifest.routes) {
    const normalizedRoutePath = normalizeRoute(route.path);

    if (
      normalizedPath === normalizedRoutePath ||
      normalizedPath.startsWith(`${normalizedRoutePath}/`)
    ) {
      if (normalizedRoutePath.length > longestMatchLength) {
        matchedRoute = route;
        longestMatchLength = normalizedRoutePath.length;
      }
    }
  }

  return matchedRoute;
};

const computeRouteInfo = (
  pathname: string,
  manifest?: RouteManifest | null
): RouteInfo => {
  const normalizedPath = normalizeRoute(pathname);
  const matchedRoute = findMatchingRoute(normalizedPath, manifest);

  if (!matchedRoute) {
    return {
      normalizedPath,
      baseRoute: normalizedPath,
    };
  }

  const baseRoute = normalizeRoute(matchedRoute.path);

  if (normalizedPath === baseRoute) {
    return {
      normalizedPath,
      baseRoute,
      manifestRoute: matchedRoute,
    };
  }

  const remainder = normalizedPath.slice(baseRoute.length + 1);
  const [viewKey] = remainder.split("/");

  return {
    normalizedPath,
    baseRoute,
    viewKey: viewKey || undefined,
    manifestRoute: matchedRoute,
  };
};

export const useRouteInfo = (): RouteInfo => {
  const location = useLocation();
  const { routeManifest } = useManifest();

  return useMemo(
    () => computeRouteInfo(location.pathname, routeManifest),
    [location.pathname, routeManifest]
  );
};

export type { RouteInfo };
