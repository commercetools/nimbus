import { Search } from "@bleh-ui/icons";
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
  Heading,
  Text,
  Bleed,
  DialogHeader,
  DialogTitle,
} from "@bleh-ui/react";
import * as Icons from "@bleh-ui/icons";

// TODO: Replace with react-aria solution
import {
  Combobox,
  ComboboxItem,
  ComboboxList,
  ComboboxProvider,
} from "@ariakit/react";

import { forwardRef, MouseEvent, useMemo, useRef, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  SearchableDocItem,
  searchableDocItemsAtom,
  searchQueryAtom,
} from "../../atoms/searchable-docs.ts";
import { activeRouteAtom } from "../../atoms/route";
import Fuse from "fuse.js";

type SearchResultItemProps = {
  item: SearchableDocItem;
  score: number | undefined;
  ["data-active-item"]?: boolean;
};

const SearchResultItem = forwardRef(
  ({ item, score, ...props }: SearchResultItemProps, ref) => {
    const isSelected = !!props["data-active-item"];

    const IconComponent =
      (Icons[item.icon as keyof typeof Icons] as React.ElementType) ||
      Icons.FileText;

    const styles = isSelected
      ? { bg: "primary.9", color: "primary.contrast" }
      : {};

    return (
      <Flex px="6" py="3">
        <Box pr="4" pt="1">
          <IconComponent size="1.5em" />
        </Box>
        <Box
          display="flex"
          flexDir="column"
          gap="0"
          ref={ref}
          {...styles}
          {...props}
        >
          <Heading size="lg" truncate>
            {item.title}{" "}
          </Heading>
          <Text mb="1" truncate>
            {item.description}
          </Text>
          <Text my="1" textStyle="xs" truncate opacity={3 / 4}>
            {item.menu.join(" -> ")}
          </Text>
        </Box>
      </Flex>
    );
  }
);

export const AppNavBarSearch = () => {
  const [, setActiveRoute] = useAtom(activeRouteAtom);
  const [q, setQ] = useAtom(searchQueryAtom);
  const searchableDocs = useAtomValue(searchableDocItemsAtom);

  const comboboxRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(() => {
    const fuseOptions = {
      // nobody cares about the case
      isCaseSensitive: false,
      // nobody cares where the string is found
      ignoreLocation: true,
      // we want the score (0 = perfect - 1 = garbage)
      includeScore: true,
      // we want stuff sorted by score
      shouldSort: true,
      // fields with shorter content usually score higher, we don't want that
      ignoreFieldNorm: true,
      // highlight the matches
      includeMatches: true,
      // search all specified fields, not jus the first 60 characters
      findAllMatches: true,
      // unix like search operators? hell yeah:
      useExtendedSearch: false,
      // only the matches whose length exceeds this value will be returned
      minMatchCharLength: 2,
      keys: ["title", "description", "content"],
    };

    return new Fuse(searchableDocs || [], fuseOptions);
  }, [searchableDocs]);

  const results = fuse.search(q);

  const [open, setOpen] = useState(false);
  useHotkeys(
    "mod+k",
    () => {
      console.log("Focus search input");
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
            width="100%"
            maxWidth="96"
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
              <Text color="colorPalette.11" alignSelf="flex-end">
                {searchableDocs.length} Documents
              </Text>
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
                    width="100%"
                    mx="auto"
                    mt="4"
                    mb="6"
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

                <Bleed inline="6">
                  <Box maxHeight="lg" divideY="1px" overflow="auto" asChild>
                    <ComboboxList ref={listboxRef} role="listbox">
                      {results?.map((item) => (
                        <Box>
                          {/* <div>
                      <pre>{JSON.stringify(item, null, 2)}</pre>
                    </div> */}
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
