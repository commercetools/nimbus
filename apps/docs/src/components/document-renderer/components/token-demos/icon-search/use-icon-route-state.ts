import { useCallback, useEffect, useMemo } from "react";
// Import router hooks from `react-router-dom`, NOT bare `react-router`: a
// duplicate `react-router@8.1.0` is installed alongside `react-router-dom@7.x`,
// and importing from the bare package yields a different module instance —
// a mismatched Router context that would throw or silently desync.
import {
  useLocation,
  useNavigate,
  useNavigationType,
  useSearchParams,
} from "react-router-dom";

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
 * keystroke's mirrored search — never spams history and Back leaves `/icons`).
 * Opening an icon pushes an entry; clicking a "Similar icons" tile pushes
 * another, building a back-trail (Back retraces icon → icon → grid). Closing the
 * dialog (X / Escape) pops the whole trail in one step, straight back to the
 * filtered grid — restoring its scroll position.
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
 * Back-trail bookkeeping for the detail dialog, module-scoped because it models
 * the single browser history shared by every hook consumer — and because it must
 * NOT survive a reload (a reload starts a fresh, unknowable stack; module scope
 * resets for free, unlike `history.state`).
 *
 * `trailKeys` holds the `location.key` of each icon-detail entry currently
 * stacked above the grid, oldest → newest, so its length is exactly how many
 * history steps `closeIcon` pops to land back on the grid. It's reconciled on
 * every navigation (push grows it, back/forward truncates it by key), so native
 * Back/forward keeps it honest.
 *
 * `gridBeneath` records whether the bottom of that trail sits on OUR OWN grid
 * entry — true only when the first icon was opened from the grid within this
 * session. A deep-linked icon (no grid beneath) leaves it false, so `closeIcon`
 * falls back to navigating to the grid URL instead of `navigate(-n)` walking
 * off-site.
 */
let trailKeys: string[] = [];
let gridBeneath = false;
/**
 * The last `location.key` reconciled by the effect. The hook runs in several
 * components per render; this guard lets only the first to observe a new key
 * mutate `trailKeys`, keeping the reconciliation idempotent.
 */
let lastReconciledKey: string | null = null;

/** Clamp a raw `size` param to the slider's valid set (24..96 step 8). */
const readSize = (raw: string | null): number => {
  // An absent (default-omitted) or empty param is the default. Guard before
  // `Number`, since `Number(null)` and `Number("")` are 0 — not NaN — so the
  // isFinite check below wouldn't catch them and they'd clamp down to the min.
  if (raw == null || raw === "") return ICON_SIZE_DEFAULT;
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
  /** Filter to a keyword tag on the grid, dropping any open dialog. */
  goToTag: (tag: string) => void;
  /** Open an icon's detail dialog (pushes history). */
  openIcon: (name: string) => void;
  /** Close the detail dialog, returning to the current filtered grid. */
  closeIcon: () => void;
}

export const useIconRouteState = (): IconRouteState => {
  const location = useLocation();
  const navigate = useNavigate();
  const navType = useNavigationType();
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

  // Reconcile the back-trail against the current history entry. Runs on every
  // navigation; the `lastReconciledKey` guard makes it idempotent across the
  // several components that call this hook.
  //   • grid (or any non-icon view) → the trail is empty and nothing is beneath.
  //   • PUSH onto an icon → a new detail entry was opened (grid→icon or the
  //     similar-row's icon→icon); append its key.
  //   • POP onto an icon → Back/forward. If it's a key we know, truncate to it;
  //     if not (a deep-link's own entry, or forward past what we tracked), we
  //     don't own a grid beneath it, so clear the trail AND `gridBeneath`.
  //   • REPLACE onto an icon → swap the top key in place (depth unchanged).
  useEffect(() => {
    const key = location.key;
    if (key === lastReconciledKey) return;
    lastReconciledKey = key;

    if (iconName === null) {
      trailKeys = [];
      gridBeneath = false;
      return;
    }
    if (navType === "PUSH") {
      trailKeys.push(key);
    } else if (navType === "POP") {
      const i = trailKeys.indexOf(key);
      if (i >= 0) {
        trailKeys = trailKeys.slice(0, i + 1);
      } else {
        trailKeys = [];
        gridBeneath = false;
      }
    } else if (trailKeys.length > 0) {
      // REPLACE staying on an icon entry.
      trailKeys[trailKeys.length - 1] = key;
    }
  }, [location.key, iconName, navType]);

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

  const goToTag = useCallback(
    (nextTag: string) => {
      const next = new URLSearchParams(params);
      if (!nextTag) next.delete(PARAM.tag);
      else next.set(PARAM.tag, nextTag);
      // Same shape as goToCategory: jump to the grid (dropping any `:name`, which
      // closes the dialog) with this keyword facet active, preserving the other
      // filters, and replacing rather than leaving a back-step.
      navigate(
        { pathname: ICON_BASE, search: next.toString() },
        { replace: true }
      );
    },
    [params, navigate]
  );

  const openIcon = useCallback(
    (name: string) => {
      // Opening from the grid roots a fresh trail on top of our own grid entry,
      // so a later close can pop straight back to it. Opening from within the
      // dialog — a "Similar icons" click — extends the current trail instead and
      // leaves `gridBeneath` as-is (the effect appends the new entry's key).
      if (iconName === null) gridBeneath = true;
      navigate(
        {
          pathname: `${ICON_BASE}/${encodeURIComponent(name)}`,
          search: location.search,
        },
        { state: { fromBrowse: true } }
      );
    },
    [navigate, location.search, iconName]
  );

  const closeIcon = useCallback(() => {
    if (gridBeneath && trailKeys.length > 0) {
      // Pop the entire icon back-trail in one step, straight to our own grid
      // entry — restoring its scroll position.
      const depth = trailKeys.length;
      trailKeys = [];
      gridBeneath = false;
      navigate(-depth);
    } else {
      // Deep-link / reload / forward-nav / arrived from another page: no owned
      // grid to pop back to, so land on the grid URL with filters preserved
      // rather than risking `navigate(-n)` leaving the site.
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
    goToTag,
    openIcon,
    closeIcon,
  };
};
