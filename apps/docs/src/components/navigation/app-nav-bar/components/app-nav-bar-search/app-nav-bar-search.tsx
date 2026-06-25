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
  type KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
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

type SearchResultRowProps = {
  item: SearchableDocItem;
  domId: string;
  isActive: boolean;
  onSelect: (item: SearchableDocItem) => void;
  onActivate: (id: string) => void;
};

/**
 * A single result row. Memoized so that typing only re-renders rows whose item
 * or active state actually changed — re-styling all ~20 rich rows on every
 * keystroke was the source of per-keystroke jank. Relies on stable `item`
 * references (search index entries) and stable `onSelect`/`onActivate`.
 */
const SearchResultRow = memo(function SearchResultRow({
  item,
  domId,
  isActive,
  onSelect,
  onActivate,
}: SearchResultRowProps) {
  return (
    <Flex
      id={domId}
      role="option"
      aria-selected={isActive}
      data-active={isActive ? "" : undefined}
      onClick={() => onSelect(item)}
      onPointerMove={() => onActivate(item.id)}
      css={{
        "&[data-active]": {
          backgroundColor: "primary.9",
          color: "primary.contrast",
        },
      }}
      direction="column"
      gap="1"
      py="100"
      px="600"
      cursor="pointer"
      borderBottom="1px solid"
      borderBottomColor="neutral.6"
    >
      <SearchResultItem item={item} />
    </Flex>
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

  useHotkeys(
    "mod+k",
    () => {
      setOpen(true);
    },
    [open]
  );

  // The results render as a plain list (not a React Aria ComboBox collection) so
  // it updates reliably when results arrive asynchronously (semantic search).
  // Keyboard navigation follows the ARIA combobox pattern with *virtual* focus:
  // the input keeps real DOM focus (so typing/deleting always works), while the
  // arrow keys move a highlighted option tracked via aria-activedescendant.
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const optionDomId = useCallback(
    (id: string) => `${listboxId}-option-${id}`,
    [listboxId]
  );

  // Id of the highlighted result, or null. Tracked by id (not index) so the
  // memoized rows survive result reordering between keystrokes.
  const [activeId, setActiveId] = useState<string | null>(null);

  // Reset the highlight whenever the result set changes (e.g. on each keystroke).
  useEffect(() => {
    setActiveId(null);
  }, [results]);

  // Keep the highlighted option scrolled into view.
  useEffect(() => {
    if (!activeId || !listRef.current) return;
    const el = listRef.current.querySelector(
      `#${CSS.escape(optionDomId(activeId))}`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeId, optionDomId]);

  const navigateToItem = useCallback(
    (item: SearchableDocItem) => {
      setOpen(false);
      navigate(`/${item.route}`);
      setQuery("");
    },
    [navigate, setOpen, setQuery]
  );

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;
    const current = activeId ? results.findIndex((r) => r.id === activeId) : -1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveId(results[(current + 1) % results.length].id);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveId(
          results[current <= 0 ? results.length - 1 : current - 1].id
        );
        break;
      case "Enter":
        if (current >= 0) {
          e.preventDefault();
          navigateToItem(results[current]);
        }
        break;
    }
  };

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
            <Flex alignItems="center" width="100%" py="400" pb="600">
              <Box
                border="1px solid"
                borderColor="neutral.6"
                focusRing="outside"
                height="1000"
                textStyle="md"
                _placeholder={{
                  opacity: 0.5,
                  color: "currentColor",
                }}
                px="400"
                borderRadius="200"
                width="full"
                asChild
              >
                {/** TODO: TextInput should actually work here, try again once it's fixed*/}
                <input
                  ref={inputRef}
                  autoFocus
                  type="search"
                  role="combobox"
                  aria-label="Search the documentation"
                  aria-controls={listboxId}
                  aria-expanded={results.length > 0}
                  aria-autocomplete="list"
                  aria-activedescendant={
                    activeId ? optionDomId(activeId) : undefined
                  }
                  placeholder="Type to search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                />
              </Box>
            </Flex>
            <Box mx="-600">
              <Separator />
              {/* Category filter tabs. Controlled, click-driven — the search
                  input keeps DOM focus (virtual-focus combobox), so we restore
                  focus to it after a tab selection to keep typing seamless. The
                  single panel's id always tracks the selected tab, so React Aria
                  renders exactly one panel and we keep ONE listbox instance,
                  preserving the aria-controls / aria-activedescendant wiring. */}
              {visibleCategories.length > 0 && (
                <>
                  <Tabs.Root
                    variant="pills"
                    orientation="vertical"
                    size="md"
                    selectedKey={selectedCategory}
                    onSelectionChange={(key) => {
                      setSelectedCategory(key as SearchCategoryKey);
                      // Defer past React Aria's own focus management — clicking
                      // a tab focuses that tab after this handler runs, so we
                      // move focus back to the input on the next frame to keep
                      // typing seamless (virtual-focus combobox).
                      requestAnimationFrame(() => inputRef.current?.focus());
                    }}
                  >
                    {/* Left rail. The vertical `line` recipe draws the divider
                        between rail and content; the rail stretches to the row
                        height so that divider spans the full result list. */}
                    <Tabs.List
                      pl="200"
                      pt="200"
                      minWidth="14rem"
                      borderRadius="0"
                    >
                      {visibleCategories.map((key) => (
                        <Tabs.Tab key={key} id={key}>
                          <Box flexGrow="1" textAlign="left">
                            {CATEGORY_LABELS[key]}
                          </Box>
                          <Text as="span" color="neutral.11" fontSize="inherit">
                            {categoryCounts[key]}
                          </Text>
                        </Tabs.Tab>
                      ))}
                    </Tabs.List>
                    <Tabs.Panels>
                      <Tabs.Panel id={selectedCategory}>
                        {/* ScrollArea bounds the results so they scroll on their
                            own, keeping the search input and tab rail pinned. */}
                        <ScrollArea orientation="vertical" maxHeight="60vh">
                          <Box
                            ref={listRef}
                            id={listboxId}
                            role="listbox"
                            aria-label="Search results"
                          >
                            {results.map((item) => (
                              <SearchResultRow
                                key={item.id}
                                item={item}
                                domId={optionDomId(item.id)}
                                isActive={item.id === activeId}
                                onSelect={navigateToItem}
                                onActivate={setActiveId}
                              />
                            ))}
                          </Box>
                        </ScrollArea>
                      </Tabs.Panel>
                    </Tabs.Panels>
                  </Tabs.Root>
                  {/* Divider between the results content and the footer hint. */}
                  <Separator />
                </>
              )}
            </Box>
            <Text textStyle="xs" color={"neutral.11"} pt="600">
              Use the <strong>Arrow</strong>-keys to navigate and{" "}
              <strong>Enter</strong> to confirm selection.
            </Text>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
};
