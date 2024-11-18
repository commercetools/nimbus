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
} from "@bleh-ui/react";

import {
  Combobox,
  ComboboxItem,
  ComboboxList,
  ComboboxProvider,
} from "@ariakit/react";

import { forwardRef, useMemo, useRef, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { searchableDocItems } from "../../atoms/searchableDocs";
import { activeRouteAtom } from "../../atoms/route";
import take from "lodash/take";

const SearchResultItem = forwardRef(({ item, ...props }, ref) => {
  const isSelected = !!props["data-active-item"];

  const styles = isSelected
    ? { bg: "primary.9", color: "primary.contrast" }
    : {};

  return (
    <Box px="6" py="2" ref={ref} {...styles} {...props}>
      <Heading size="lg">{item.title}</Heading>
      <Text truncate>{item.description}</Text>
    </Box>
  );
});

export const AppNavBarSearch = () => {
  const [q, setQ] = useState("");
  const [, setActiveRoute] = useAtom(activeRouteAtom);
  const comboboxRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const searchableItems2 = useAtomValue(searchableDocItems);
  const results = useMemo(() => {
    const lowerCaseQuery = q.toLowerCase();
    const keys = ["title", "description"];

    return searchableItems2.filter((item) =>
      keys.some((key) => item[key]?.toLowerCase().includes(lowerCaseQuery))
    );
  }, [q, searchableItems2]);

  const [open, setOpen] = useState(false);
  useHotkeys(
    "mod+k",
    () => {
      console.log("Focus search input");
      setOpen(true);
    },
    [open]
  );

  const onItemConfirm = (e, item) => {
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
        closeOnInteractOutside={false}
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
        <DialogContent>
          <DialogBody>
            <ComboboxProvider open={open} setOpen={setOpen}>
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
                    <Combobox placeholder="e.g., Apple, Banana" />
                  </Input>
                </InputGroup>
              </Box>
              <ComboboxList ref={listboxRef} role="listbox">
                {take(results, 5).map((item) => (
                  <Bleed key={item.id} inline="6">
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
                        value={item.title}
                        onClick={(e) => onItemConfirm(e, item)}
                      >
                        <SearchResultItem item={item} />
                      </ComboboxItem>
                    </Box>
                  </Bleed>
                ))}
              </ComboboxList>
            </ComboboxProvider>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Flex>
  );
};
