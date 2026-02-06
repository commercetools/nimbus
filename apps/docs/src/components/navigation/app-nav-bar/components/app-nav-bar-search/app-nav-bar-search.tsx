import {
  Flex,
  Box,
  useHotkeys,
  Dialog,
  Separator,
  TextInput,
  Text,
  Kbd,
} from "@commercetools/nimbus";

import { ComboBox, Input, ListBox, ListBoxItem } from "react-aria-components";

import { Key } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "./hooks/use-search";
import { SearchResultItem } from "./components/search-result-item";
import { SearchableDocItem } from "@/atoms/searchable-docs";

export type SearchResultItemProps = {
  item: SearchableDocItem;
};

export const AppNavBarSearch = () => {
  const navigate = useNavigate();
  const { query, setQuery, results, open, setOpen } = useSearch();

  useHotkeys(
    "mod+k",
    () => {
      setOpen(true);
    },
    [open]
  );

  const handleSelectionChange = (key: Key | null) => {
    if (key === null) return;

    const selectedItem = results.find((item) => item.id === key);
    if (selectedItem) {
      setOpen(false);
      navigate(`/${selectedItem.route}`);
      setQuery("");
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
            <Dialog.Title>Search the Documentation</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Separator />
          <Dialog.Body>
            <ComboBox
              inputValue={query}
              onInputChange={setQuery}
              onSelectionChange={handleSelectionChange}
              defaultFilter={() => true} // Disable built-in filtering to allow custom filtering mostly for the Fuse.js search
              allowsCustomValue
            >
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
                  <Input autoFocus placeholder="Type to search..." />
                </Box>
              </Flex>
              <Box mx="-600">
                <Separator />
                <ListBox items={results} selectionMode="single">
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
            </ComboBox>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
};
