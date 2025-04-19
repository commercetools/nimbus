import {
  Flex,
  Box,
  useHotkeys,
  DialogHeader,
  DialogTitle,
  TextInput,
  DialogRoot,
  DialogBackdrop,
  DialogTrigger,
  DialogContent,
  DialogBody,
  Text,
  Bleed,
  Kbd,
} from "@commercetools/nimbus";

import { ComboBox, Input, ListBox, ListBoxItem } from "react-aria-components";

import { Key } from "react";
import { useAtom } from "jotai";
import { activeRouteAtom } from "@/atoms/route";
import { useSearch } from "./hooks/use-search";
import { SearchResultItem } from "./components/search-result-item";
import { SearchableDocItem } from "@/atoms/searchable-docs";

export type SearchResultItemProps = {
  item: SearchableDocItem;
};

export const AppNavBarSearch = () => {
  const [, setActiveRoute] = useAtom(activeRouteAtom);
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
      setActiveRoute(selectedItem.route);
    }
  };

  return (
    <Flex grow="1">
      <DialogRoot
        open={open}
        placement="top"
        motionPreset="slide-in-bottom"
        onOpenChange={() => setOpen(!open)}
        scrollBehavior="outside"
        size="xl"
      >
        <DialogBackdrop />
        <DialogTrigger>
          <Box position="relative">
            <TextInput
              size="md"
              width="320px"
              type="search"
              placeholder="Search for a component..."
              onFocus={(e) => e.target.blur()}
            />

            <Box position="absolute" top="150" right="250" color="neutral.11">
              <Kbd>⌘+K</Kbd>
            </Box>
          </Box>
        </DialogTrigger>
        <DialogContent divideY="1px" backdropBlur="5px">
          <DialogHeader>
            <DialogTitle fontWeight="600">Search the Documentation</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <ComboBox
              inputValue={query}
              onInputChange={setQuery}
              onSelectionChange={handleSelectionChange}
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
                  <Input placeholder="Type to search..." />
                </Box>
              </Flex>
              <Bleed inline="600" borderTop="1px solid" borderColor="neutral.6">
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
              </Bleed>
              <Text textStyle="xs" color={"neutral.11"} pt="600">
                Use the <strong>Arrow</strong>-keys to navigate and{" "}
                <strong>Enter</strong> to confirm selection.
              </Text>
            </ComboBox>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Flex>
  );
};
