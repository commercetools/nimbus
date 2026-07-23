import { useCallback, useEffect, useMemo } from "react";
// Import router hooks from `react-router-dom`, NOT bare `react-router`: a
// duplicate `react-router@8.1.0` is installed alongside `react-router-dom@7.x`,
// and importing from the bare package yields a different module instance —
// a mismatched Router context that would throw or silently desync.
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import {
  DEFAULT_SURFACE,
  ICON_SIZE_DEFAULT,
  ICON_SIZE_MAX,
  ICON_SIZE_MIN,
  ICON_SIZE_STEP,
  type Surface,
} from "./icon-display-controls";
import { ALL_CATEGORIES, ALL_ICON_NAMES } from "./use-icon-data";

/**
 * The whole icon browser is deep-linkable: every piece of browsing state lives
 * in the URL, so any view (a filtered grid, a specific icon's detail) reloads
 * and shares as-is. This hook is the single source of truth over that URL,
 * wrapping react-router so no component parses the location by hand.
 *
 *   /icons/:name                             — the icon detail dialog (path)
 *   ?category=:slug  ?tag=:t  ?search=:q      — the AND-combined filters
 *   ?size=:px        ?surface=:shape          — the grid display preferences
 *
 * A param equal to its default is omitted, so a pristine grid is just `/icons`.
 * Filter/display writes use `{ replace: true }` (so a tweak — including every
 * keystroke's mirrored search — never spams history and Back leaves `/icons`);
 * opening an icon pushes an entry so Back closes the dialog and restores the
 * exact filtered grid.
 */

const ICON_BASE = "/icons";
const SURFACES: readonly Surface[] = ["none", "square", "circle"];
const VALID_ICON_NAMES = new Set(ALL_ICON_NAMES);

/** Query-param keys. */
const PARAM = {
  category: "category",
  tag: "tag",
  search: "search",
  size: "size",
  surface: "surface",
} as const;

/**
 * Whether the detail dialog was opened by a push within THIS (un-reloaded) SPA
 * session — the only case where the previous history entry is provably our own
 * grid, so `navigate(-1)` on close is safe (and restores scroll). Module-scoped
 * rather than `location.state` on purpose: a reload preserves `history.state`,
 * which would make a "was pushed" signal survive the reload and let
 * `navigate(-1)` walk off-site. Reset to false whenever the grid is showing.
 */
let didPushDetail = false;

/** Clamp a raw `size` param to the slider's valid set (24..96 step 8). */
const readSize = (raw: string | null): number => {
  const n = Number(raw);
  if (!Number.isFinite(n)) return ICON_SIZE_DEFAULT;
  const clamped = Math.min(ICON_SIZE_MAX, Math.max(ICON_SIZE_MIN, n));
  return (
    ICON_SIZE_MIN +
    Math.round((clamped - ICON_SIZE_MIN) / ICON_SIZE_STEP) * ICON_SIZE_STEP
  );
};

/** Validate a raw `surface` param against the union, else the default. */
const readSurface = (raw: string | null): Surface =>
  SURFACES.includes(raw as Surface) ? (raw as Surface) : DEFAULT_SURFACE;

export interface IconRouteState {
  /** The icon whose detail dialog is open, or null. Validated: an unknown name resolves to null (no dialog). */
  iconName: string | null;
  /** Active category slug; `ALL_CATEGORIES` ("all") when unfiltered. */
  category: string;
  /** Active keyword facet, or null. */
  tag: string | null;
  /** Search text. */
  search: string;
  /** Previewed glyph size (px), snapped to the slider's step. */
  size: number;
  /** Optional shape drawn behind each glyph. */
  surface: Surface;

  setTag: (tag: string | null) => void;
  setSearch: (search: string) => void;
  setSize: (size: number) => void;
  setSurface: (surface: Surface) => void;

  /** Filter to a category (stays on the grid, dropping any open dialog). */
  goToCategory: (slug: string) => void;
  /** Open an icon's detail dialog (pushes history). */
  openIcon: (name: string) => void;
  /** Close the detail dialog, returning to the current filtered grid. */
  closeIcon: () => void;
}

export const useIconRouteState = (): IconRouteState => {
  const location = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  // There is no literal `:name` route — `/icons/*` is served by the app's
  // catch-all and longest-prefix-resolved to the single `/icons` doc — so the
  // name must be read from the pathname, not `useParams()`. Validated against
  // the known export names (available synchronously) so a bad segment degrades
  // to "no dialog" instead of rendering an empty shell.
  const iconName = useMemo(() => {
    const sub = location.pathname
      .replace(/^\/icons\/?/, "")
      .replace(/\/+$/, "");
    const first = sub ? decodeURIComponent(sub.split("/")[0]) : "";
    return first && VALID_ICON_NAMES.has(first) ? first : null;
  }, [location.pathname]);

  const category = params.get(PARAM.category) ?? ALL_CATEGORIES;
  const tag = params.get(PARAM.tag) || null;
  const search = params.get(PARAM.search) ?? "";
  const size = readSize(params.get(PARAM.size));
  const surface = readSurface(params.get(PARAM.surface));

  // Keep the "was pushed this session" flag honest: whenever the grid is
  // showing (the dialog was closed by any means — X, Escape, category badge, or
  // a manual Back), a subsequent open is a fresh push. Idempotent across the
  // several components that call this hook.
  useEffect(() => {
    if (iconName === null) didPushDetail = false;
  }, [iconName]);

  // Immutable, default-omitting, replace-based writer for a single query param.
  // The functional updater reads the live params, so unrelated params are never
  // clobbered even across rapid successive writes.
  const writeParam = useCallback(
    (key: string, value: string | null, dflt: string) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value == null || value === "" || value === dflt) next.delete(key);
          else next.set(key, value);
          return next;
        },
        { replace: true }
      );
    },
    [setParams]
  );

  const setTag = useCallback(
    (value: string | null) => writeParam(PARAM.tag, value, ""),
    [writeParam]
  );
  const setSearch = useCallback(
    (value: string) => writeParam(PARAM.search, value, ""),
    [writeParam]
  );
  const setSize = useCallback(
    (value: number) =>
      writeParam(PARAM.size, String(value), String(ICON_SIZE_DEFAULT)),
    [writeParam]
  );
  const setSurface = useCallback(
    (value: Surface) => writeParam(PARAM.surface, value, DEFAULT_SURFACE),
    [writeParam]
  );

  const goToCategory = useCallback(
    (slug: string) => {
      const next = new URLSearchParams(params);
      if (slug === ALL_CATEGORIES) next.delete(PARAM.category);
      else next.set(PARAM.category, slug);
      // Navigate to the grid path (dropping any `:name` segment, which closes
      // an open dialog) while preserving the other filters. Replace: a filter
      // change shouldn't leave a back-step behind.
      navigate(
        { pathname: ICON_BASE, search: next.toString() },
        { replace: true }
      );
    },
    [params, navigate]
  );

  const openIcon = useCallback(
    (name: string) => {
      didPushDetail = true;
      navigate(
        {
          pathname: `${ICON_BASE}/${encodeURIComponent(name)}`,
          search: location.search,
        },
        { state: { fromBrowse: true } }
      );
    },
    [navigate, location.search]
  );

  const closeIcon = useCallback(() => {
    if (didPushDetail) {
      didPushDetail = false;
      // Return to the exact prior grid entry (with scroll restoration).
      navigate(-1);
    } else {
      // Deep-link / reload / arrived from another page: no owned entry to pop,
      // so land on the grid with filters preserved rather than leaving the site.
      navigate(
        { pathname: ICON_BASE, search: location.search },
        { replace: true }
      );
    }
  }, [navigate, location.search]);

  return {
    iconName,
    category,
    tag,
    search,
    size,
    surface,
    setTag,
    setSearch,
    setSize,
    setSurface,
    goToCategory,
    openIcon,
    closeIcon,
  };
};
