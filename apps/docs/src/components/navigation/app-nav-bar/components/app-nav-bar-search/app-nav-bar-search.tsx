import {
  Flex,
  Box,
  useHotkeys,
  Dialog,
  ScrollArea,
  Separator,
  Tabs,
  TextInput,
  Text,
  Kbd,
  Switch,
} from "@commercetools/nimbus";
import {
  Autocomplete,
  ListBox,
  ListBoxItem,
  SearchField,
  Input,
  Virtualizer,
  ListLayout,
  type Key,
} from "react-aria-components";
import { memo, useCallback, useMemo } from "react";
import { useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { useSearch } from "./hooks/use-search";
import { SearchResultItem } from "./components/search-result-item";
import { SearchableDocItem } from "@/atoms/searchable-docs";
import { semanticEnabledAtom } from "@/atoms/semantic-search";
import { CATEGORY_LABELS, type SearchCategoryKey } from "./search-categories";

export type SearchResultItemProps = {
  item: SearchableDocItem;
};

/**
 * Result rows are uniform height — the description and breadcrumb are truncated
 * to a single line each — so the virtualized list uses a fixed row size (px,
 * measured) rather than estimated/variable heights. Keep in sync with the
 * SearchResultItem layout if its padding/line count changes.
 */
const RESULT_ROW_HEIGHT = 101;
const RESULT_LIST_LAYOUT_OPTIONS = { rowSize: RESULT_ROW_HEIGHT };

/**
 * A single result option in the React Aria `ListBox`. The list runs under an
 * `Autocomplete`, so virtual focus (driven by the search input's arrow keys)
 * lands on the matching `ListBoxItem` and marks it `data-focused` — that's what
 * the highlight styling keys off. Memoized so typing only re-renders rows whose
 * item actually changed; re-styling all ~20 rich rows per keystroke was the
 * source of per-keystroke jank.
 */
const SearchResultOption = memo(function SearchResultOption({
  item,
}: SearchResultItemProps) {
  return (
    <Box
      asChild
      display="block"
      cursor="pointer"
      outline="none"
      borderBottom="1px solid"
      borderBottomColor="neutral.6"
      css={{
        // Mouse hover — a subtle cue, distinct from the strong keyboard-focus
        // highlight below so the two don't compete when both are present.
        "&[data-hovered]": {
          backgroundColor: "primary.3",
        },
        // Keyboard virtual focus (arrow keys move aria-activedescendant here).
        "&[data-focused]": {
          backgroundColor: "primary.9",
          color: "primary.contrast",
        },
      }}
    >
      <ListBoxItem id={item.id} textValue={item.title}>
        <Box px="600">
          <SearchResultItem item={item} />
        </Box>
      </ListBoxItem>
    </Box>
  );
});

export const AppNavBarSearch = () => {
  const navigate = useNavigate();
  const {
    query,
    setQuery,
    results,
    open,
    setOpen,
    selectedCategory,
    setSelectedCategory,
    categoryCounts,
    visibleCategories,
    semanticEnabled,
    semanticStatus,
    semanticDownloadPercent,
  } = useSearch();
  const setSemanticEnabled = useSetAtom(semanticEnabledAtom);

  // Human-readable status shown next to the toggle while semantic search loads.
  const semanticStatusLabel =
    !semanticEnabled || semanticStatus === "ready"
      ? null
      : semanticStatus === "loading-model"
        ? `Downloading model… ${Math.round(semanticDownloadPercent)}%`
        : semanticStatus === "indexing"
          ? "Indexing documentation…"
          : semanticStatus === "error"
            ? "Semantic search unavailable — using fuzzy search."
            : null;

  // Whether the search has settled enough to trust an empty result set: fuzzy
  // is synchronous, semantic settles at "ready" (or falls back to fuzzy on
  // "error"). Guards the "No results" message so it never flashes while the
  // model is still downloading/indexing.
  const searchSettled =
    !semanticEnabled ||
    semanticStatus === "ready" ||
    semanticStatus === "error";
  const showNoResults =
    query.trim().length > 0 && results.length === 0 && searchSettled;

  useHotkeys(
    "mod+k",
    () => {
      setOpen(true);
    },
    [open]
  );

  const navigateToItem = useCallback(
    (item: SearchableDocItem) => {
      setOpen(false);
      navigate(`/${item.route}`);
      setQuery("");
    },
    [navigate, setOpen, setQuery]
  );

  // `ListBox.onAction` hands back the activated item's key (its id). Resolve it
  // against the currently-rendered results to navigate.
  const resultsById = useMemo(
    () => new Map(results.map((item) => [item.id, item])),
    [results]
  );
  const handleAction = useCallback(
    (key: Key) => {
      const item = resultsById.get(String(key));
      if (item) navigateToItem(item);
    },
    [resultsById, navigateToItem]
  );

  return (
    <Flex grow="1">
      <Dialog.Root
        isOpen={open}
        placement="top"
        onOpenChange={() => setOpen(!open)}
        scrollBehavior="inside"
      >
        <Dialog.Trigger>
          <Box position="relative">
            <TextInput
              size="sm"
              type="search"
              placeholder="Search documentation..."
              onFocus={(e) => e.target.blur()}
              aria-label="Search the documentation"
              trailingElement={<Kbd fontSize=".75em">⌘+K</Kbd>}
            />
          </Box>
        </Dialog.Trigger>
        <Dialog.Content width="5xl">
          <Dialog.Header>
            <Flex direction="column" gap="100" grow="1">
              <Dialog.Title>Search the Documentation</Dialog.Title>
              <Flex alignItems="center" gap="300" minHeight="600">
                <Switch
                  isSelected={semanticEnabled}
                  onChange={setSemanticEnabled}
                  size="sm"
                >
                  Semantic search (beta)
                </Switch>
                {semanticStatusLabel && (
                  <Text textStyle="xs" color="neutral.11">
                    {semanticStatusLabel}
                  </Text>
                )}
              </Flex>
            </Flex>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Separator />
          <Dialog.Body>
            {/* React Aria Autocomplete wires the search input to the results
                ListBox: the input keeps DOM focus while arrow keys move a
                *virtual* focus through the list (aria-activedescendant), and
                Enter activates the focused row. It renders no DOM of its own,
                so the dialog layout is unaffected. We pass no `filter` — the
                results are already ranked/filtered upstream (fuzzy or semantic,
                then scoped to the selected category), so Autocomplete must not
                re-filter them. */}
            <Autocomplete inputValue={query} onInputChange={setQuery}>
              <Flex alignItems="center" width="100%" py="400" pb="600">
                <SearchField
                  autoFocus
                  aria-label="Search the documentation"
                  style={{ width: "100%" }}
                >
                  <Box
                    asChild
                    border="1px solid"
                    borderColor="neutral.6"
                    focusRing="outside"
                    height="1000"
                    textStyle="md"
                    px="400"
                    borderRadius="200"
                    width="full"
                    _placeholder={{ opacity: 0.5, color: "currentColor" }}
                  >
                    <Input placeholder="Type to search..." />
                  </Box>
                </SearchField>
              </Flex>
              <Box mx="-600">
                <Separator />
                {/* Category filter tabs form a second focus zone: Tab from the
                    input moves here, where the arrow keys switch category
                    (React Aria Tabs roving focus); Shift+Tab returns to the
                    input. The single panel's id always tracks the selected tab,
                    so exactly one panel — and one ListBox — is mounted, which
                    keeps the Autocomplete wiring stable. */}
                {visibleCategories.length > 0 && (
                  <>
                    <Tabs.Root
                      variant="pills"
                      orientation="vertical"
                      size="md"
                      selectedKey={selectedCategory}
                      onSelectionChange={(key) =>
                        setSelectedCategory(key as SearchCategoryKey)
                      }
                    >
                      <Tabs.List p="200" minWidth="14rem" borderRadius="0">
                        {visibleCategories.map((key) => (
                          <Tabs.Tab key={key} id={key}>
                            <Box flexGrow="1" textAlign="left">
                              {CATEGORY_LABELS[key]}
                            </Box>
                            <Text
                              as="span"
                              color="neutral.11"
                              fontSize="inherit"
                            >
                              {categoryCounts[key]}
                            </Text>
                          </Tabs.Tab>
                        ))}
                      </Tabs.List>
                      <Tabs.Panels>
                        <Tabs.Panel id={selectedCategory}>
                          {/* Nimbus ScrollArea owns the scroll (its Ark viewport
                              is the scroll container, giving the custom overlay
                              scrollbar) while the Virtualizer still renders only
                              the visible rows. This works because React Aria's
                              Virtualizer runs in allowsWindowScrolling mode — a
                              document-level capturing scroll listener tracks the
                              viewport's scroll, and selection-manager
                              scrollIntoView walks to the nearest scrollable
                              ancestor (the viewport) to keep the focused row in
                              view. The ListBox is left unbounded (overflow
                              visible, no max-height) so it grows to the full
                              virtual height inside the viewport; the
                              virtualizer's full-height spacer makes the
                              viewport's scrollHeight correct, so the overlay
                              scrollbar is sized right. */}
                          <ScrollArea
                            orientation="vertical"
                            maxHeight="60vh"
                            // The rail/results divider is the Tabs.List surround
                            // boxShadow, which sits at the panel's left edge —
                            // so a full-bleed row highlight paints right over it.
                            // Give the results container its own left border:
                            // it's clipped to the content box, so row
                            // backgrounds can't cover it, and it lands on the
                            // same pixel/color as the rail's shadow, reading as
                            // one crisp always-visible line.
                            borderInlineStartWidth="1px"
                            borderInlineStartStyle="solid"
                            borderInlineStartColor="neutral.6"
                          >
                            <Virtualizer
                              layout={ListLayout}
                              layoutOptions={RESULT_LIST_LAYOUT_OPTIONS}
                            >
                              <ListBox
                                aria-label="Search results"
                                items={results}
                                selectionMode="none"
                                onAction={handleAction}
                                style={{
                                  overflow: "visible",
                                  display: "block",
                                  padding: 0,
                                }}
                              >
                                {(item) => <SearchResultOption item={item} />}
                              </ListBox>
                            </Virtualizer>
                          </ScrollArea>
                        </Tabs.Panel>
                      </Tabs.Panels>
                    </Tabs.Root>
                    {/* Divider between the results content and the footer hint. */}
                    <Separator />
                  </>
                )}
                {showNoResults && (
                  <>
                    <Box py="800" px="600" textAlign="center">
                      <Text textStyle="md" color="neutral.11">
                        No results for “{query.trim()}”
                      </Text>
                    </Box>
                    <Separator />
                  </>
                )}
              </Box>
              <Text textStyle="xs" color={"neutral.11"} pt="600">
                Use the <strong>Arrow</strong>-keys to navigate and{" "}
                <strong>Enter</strong> to confirm selection.
              </Text>
            </Autocomplete>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
};
