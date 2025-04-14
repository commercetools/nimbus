import { Search } from "@commercetools/nimbus-icons";
import {
  Flex,
  Input,
  InputGroup,
  Kbd,
  useHotkeys,
  DialogRoot,
  DialogBackdrop,
  DialogTrigger,
  DialogContent,
  DialogBody,
  Box,
  Bleed,
  DialogHeader,
  DialogTitle,
} from "@commercetools/nimbus";

// TODO: Replace with react-aria solution
import {
  Combobox,
  ComboboxItem,
  ComboboxList,
  ComboboxProvider,
} from "@ariakit/react";

import { MouseEvent, useRef } from "react";
import { useAtom } from "jotai";
import { type SearchableDocItem } from "@/atoms/searchable-docs";
import { activeRouteAtom } from "@/atoms/route";
import { useSearch } from "./hooks/use-search";
import { SearchResultItem } from "./components/search-result-item";

export const AppNavBarSearch = () => {
  const comboboxRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const [, setActiveRoute] = useAtom(activeRouteAtom);

  const { query: q, setQuery: setQ, results, open, setOpen } = useSearch();

  useHotkeys(
    "mod+k",
    () => {
      setOpen(true);
    },
    [open]
  );

  const onItemConfirm = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    item: SearchableDocItem
  ) => {
    e.preventDefault();
    setOpen(false);
    setActiveRoute(item.route);
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
        <DialogTrigger asChild>
          <InputGroup
            startElement={<Search size="1em" />}
            startElementProps={{ color: "neutral.8" }}
            endElement={<Kbd>⌘K</Kbd>}
            endElementProps={{ color: "neutral.9" }}
            width="full"
            maxWidth="9600"
            mx="auto"
          >
            <Input
              type="search"
              placeholder="Search for a component..."
              size="sm"
              onFocus={(e) => e.target.blur()}
            />
          </InputGroup>
        </DialogTrigger>
        <DialogContent divideY="1px">
          <DialogHeader>
            <DialogTitle position="relative" display="flex">
              <span>Site Search</span>
              <Box flexGrow="1" />
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <ComboboxProvider open={open} setOpen={setOpen}>
              <Flex direction="column">
                <Box>
                  <InputGroup
                    startElement={<Search size="1em" />}
                    startElementProps={{ color: "neutral.8" }}
                    endElement={<Kbd>⌘K</Kbd>}
                    endElementProps={{ color: "neutral.9" }}
                    width="full"
                    mx="auto"
                    mt="400"
                    mb="600"
                  >
                    <Input
                      type="search"
                      placeholder="Search for a component..."
                      size="sm"
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      ref={comboboxRef}
                      asChild
                    >
                      <Combobox placeholder="e.g., Tokens, Component, Installation" />
                    </Input>
                  </InputGroup>
                </Box>

                <Bleed inline="600">
                  <Box maxHeight="lg" divideY="1px" overflow="auto" asChild>
                    <ComboboxList ref={listboxRef} role="listbox">
                      {results?.map((item) => (
                        <Box>
                          <Box
                            asChild
                            css={{
                              ["&[data-active-item]"]: {
                                background: "primary.9",
                                color: "primary.contrast",
                              },
                            }}
                          >
                            <ComboboxItem
                              focusOnHover
                              value={item.item.title}
                              onClick={(e) => onItemConfirm(e, item.item)}
                            >
                              <SearchResultItem
                                item={item.item}
                                score={item.score}
                              />
                            </ComboboxItem>
                          </Box>
                        </Box>
                      ))}
                    </ComboboxList>
                  </Box>
                </Bleed>
              </Flex>
            </ComboboxProvider>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Flex>
  );
};
