import { forwardRef, useContext } from "react";
import { chakra, useSlotRecipe } from "@chakra-ui/react";
import { ChevronDown, X } from "@bleh-ui/icons";

import { Flex, Box, Button, IconButton } from "@/components";
import {
  Button as RaButton,
  Label as RaLabel,
  ListBox as RaListBox,
  ListBoxItem as RaListBoxItem,
  Popover as RaPopover,
  Select as RaSelect,
  SelectValue as RaSelectValue,
  ListBoxSection as RaListBoxSection,
  Header as RaHeader,
} from "react-aria-components";
import {
  SelectRoot,
  type SelectRootProps,
  SelectOptions,
  type SelectOptionsProps,
  SelectOption,
  type SelectOptionProps,
  SelectOptionGroup,
  type SelectOptionGroupProps,
  SelectTrigger,
  type SelectTriggerProps,
  SelectTriggerLabel,
} from "./select.slots";

import { SelectStateContext } from "react-aria-components";

const SelectClearButton = () => {
  let state = useContext(SelectStateContext);

  if (!state?.selectedKey) {
    return null;
  }

  return (
    <IconButton
      pointerEvents="all"
      size="2xs"
      variant="ghost"
      tone="primary"
      aria-label="Clear Selection"
      slot={undefined}
      onPress={() => state?.setSelectedKey(null)}
    >
      <X />
    </IconButton>
  );
};

export const UnstyledSelectRoot = forwardRef<HTMLDivElement, SelectRootProps>(
  ({ children, ...props }, ref) => {
    return (
      <SelectRoot as={RaSelect} ref={ref} {...props}>
        <chakra.div position="relative">
          <SelectTrigger zIndex={0} asChild>
            <RaButton>
              <SelectTriggerLabel asChild>
                <RaSelectValue />
              </SelectTriggerLabel>
            </RaButton>
          </SelectTrigger>
          <Flex
            position="absolute"
            top="0"
            bottom="0"
            zIndex={1}
            right="400"
            pointerEvents="none"
          >
            <Flex width="600" my="auto">
              <SelectClearButton />
            </Flex>

            <Flex my="auto" w="600" h="600" pointerEvents="none">
              <Box color="neutral.9" asChild m="auto" w="400" h="400">
                <ChevronDown />
              </Box>
            </Flex>
          </Flex>
        </chakra.div>

        <RaPopover>{children}</RaPopover>
      </SelectRoot>
    );
  }
);

UnstyledSelectRoot.displayName = "Select.Root";

export const UnstyledSelectOptions = forwardRef<
  HTMLDivElement,
  SelectOptionsProps
>(({ children, ...props }, ref) => {
  return (
    <SelectOptions asChild ref={ref} {...props}>
      <RaListBox>{children}</RaListBox>
    </SelectOptions>
  );
});

UnstyledSelectOptions.displayName = "Select.Options";

export const UnstyledSelectOption = forwardRef<
  HTMLDivElement,
  SelectOptionProps
>(({ children, ...props }, ref) => {
  return (
    <SelectOption asChild ref={ref} {...props}>
      <RaListBoxItem>{children}</RaListBoxItem>
    </SelectOption>
  );
});

UnstyledSelectOptions.displayName = "Select.Option";

export const UnstyledSelectOptionGroup = forwardRef<
  HTMLDivElement,
  SelectOptionGroupProps & {
    label: string;
  }
>(({ label, children, ...props }, ref) => {
  return (
    <chakra.div asChild ref={ref} {...props}>
      <RaListBoxSection>
        <SelectOptionGroup asChild>
          <RaHeader>{label}</RaHeader>
        </SelectOptionGroup>
        {children}
      </RaListBoxSection>
    </chakra.div>
  );
});

UnstyledSelectOptions.displayName = "Select.OptionGroup";

//const SelectOptionsGroup = Box;

export const Select = {
  Root: UnstyledSelectRoot,
  Options: UnstyledSelectOptions,
  Option: UnstyledSelectOption,
  OptionGroup: UnstyledSelectOptionGroup,
};
