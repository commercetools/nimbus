import {
  Flex,
  Box,
  useHotkeys,
  Dialog,
  Separator,
  TextInput,
  Text,
  Kbd,
  Switch,
} from "@commercetools/nimbus";

import { ListBox, ListBoxItem } from "react-aria-components";

import { type Key, type KeyboardEvent, useRef } from "react";
import { useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { useSearch } from "./hooks/use-search";
import { SearchResultItem } from "./components/search-result-item";
import { SearchableDocItem } from "@/atoms/searchable-docs";
import { semanticEnabledAtom } from "@/atoms/semantic-search";

export type SearchResultItemProps = {
  item: SearchableDocItem;
};

export const AppNavBarSearch = () => {
  const navigate = useNavigate();
  const {
    query,
    setQuery,
    results,
    open,
    setOpen,
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

  // The results list is a standalone ListBox (not a ComboBox collection) so it
  // updates reliably when results arrive asynchronously (semantic search).
  const listBoxRef = useRef<HTMLDivElement>(null);

  const handleAction = (key: Key) => {
    const selectedItem = results.find((item) => item.id === key);
    if (selectedItem) {
      setOpen(false);
      navigate(`/${selectedItem.route}`);
      setQuery("");
    }
  };

  // ArrowDown from the input moves focus into the results list; React Aria then
  // focuses the first option and handles arrow navigation from there.
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && results.length > 0) {
      e.preventDefault();
      listBoxRef.current?.focus();
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
        <Dialog.Content width="3xl">
          <Dialog.Header>
            <Flex direction="column" gap="100" grow="1">
              <Dialog.Title>Search the Documentation</Dialog.Title>
              <Flex alignItems="center" gap="300" minHeight="600">
                <Switch
                  size="sm"
                  isSelected={semanticEnabled}
                  onChange={setSemanticEnabled}
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
                  autoFocus
                  type="search"
                  aria-label="Search the documentation"
                  placeholder="Type to search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                />
              </Box>
            </Flex>
            <Box mx="-600">
              <Separator />
              <ListBox
                ref={listBoxRef}
                aria-label="Search results"
                items={results}
                selectionMode="none"
                onAction={handleAction}
                shouldFocusWrap
              >
                {(item) => (
                  <Flex
                    css={{
                      "&[data-focused]": {
                        backgroundColor: "primary.9",
                        color: "primary.contrast",
                      },
                    }}
                    direction="column"
                    gap="1"
                    py="100"
                    px="600"
                    asChild
                    borderBottom="1px solid"
                    borderBottomColor="neutral.6"
                  >
                    <ListBoxItem id={item.id} textValue={item.title}>
                      <SearchResultItem item={item} />
                    </ListBoxItem>
                  </Flex>
                )}
              </ListBox>
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
