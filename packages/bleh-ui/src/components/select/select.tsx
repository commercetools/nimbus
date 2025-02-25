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
} from "./select.slots";

import { SelectStateContext } from "react-aria-components";

const SelectClearButton = () => {
  let state = useContext(SelectStateContext);
  console.log("state", state);

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

export const StyledSelectRoot = forwardRef<HTMLDivElement, SelectRootProps>(
  ({ children, ...props }, ref) => {
    return (
      <SelectRoot as={RaSelect} ref={ref} {...props}>
        <chakra.div position="relative">
          <SelectTrigger zIndex={0} paddingRight="1600" asChild>
            <RaButton>
              <RaSelectValue />
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
            <Box mt="150" width="600" height="600">
              <SelectClearButton />
            </Box>

            <Flex mt="200" w="600" h="600" pointerEvents="none">
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

StyledSelectRoot.displayName = "Select.Root";

export const StyledSelectOptions = forwardRef<
  HTMLDivElement,
  SelectOptionsProps
>(({ children, ...props }, ref) => {
  return (
    <SelectOptions asChild ref={ref} {...props}>
      <RaListBox>{children}</RaListBox>
    </SelectOptions>
  );
});

StyledSelectOptions.displayName = "Select.Options";

export const StyledSelectOption = forwardRef<HTMLDivElement, SelectOptionProps>(
  ({ children, ...props }, ref) => {
    return (
      <SelectOption asChild ref={ref} {...props}>
        <RaListBoxItem>{children}</RaListBoxItem>
      </SelectOption>
    );
  }
);

StyledSelectOptions.displayName = "Select.Option";

export const StyledSelectOptionGroup = forwardRef<
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

StyledSelectOptions.displayName = "Select.OptionGroup";

//const SelectOptionsGroup = Box;

export const Select = {
  Root: StyledSelectRoot,
  Options: StyledSelectOptions,
  Option: StyledSelectOption,
  OptionGroup: StyledSelectOptionGroup,
};
