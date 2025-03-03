import { forwardRef, useContext, type ReactNode } from "react";
import { chakra } from "@chakra-ui/react";
import {
  ChevronDown as DropdownIndicatorIcon,
  X as CloseIcon,
  LoaderCircle as SpinnerIcon,
} from "@bleh-ui/icons";

import { Flex, Box, IconButton } from "@/components";
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
      <CloseIcon />
    </IconButton>
  );
};

export const UnstyledSelectRoot = forwardRef<HTMLDivElement, SelectRootProps>(
  ({ children, variant, size, isLoading, isDisabled, ...props }, ref) => {
    return (
      <SelectRoot asChild ref={ref} variant={variant} size={size}>
        <RaSelect {...props} isDisabled={isLoading || isDisabled}>
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
                  {isLoading ? (
                    <Box asChild animation="spin" animationDuration="slowest">
                      <SpinnerIcon />
                    </Box>
                  ) : (
                    <DropdownIndicatorIcon />
                  )}
                </Box>
              </Flex>
            </Flex>
          </chakra.div>

          <RaPopover>{children}</RaPopover>
        </RaSelect>
      </SelectRoot>
    );
  }
);

UnstyledSelectRoot.displayName = "Select.Root";

export const UnstyledSelectOptions = forwardRef<
  HTMLDivElement,
  SelectOptionsProps
>(({ items, children, ...props }, forwardedRef) => {
  console.log("children", children);
  console.log("items", items);

  return (
    <SelectOptions asChild ref={forwardedRef} {...props}>
      <RaListBox>
        {items
          ? items.map((item) => (children as (item: any) => ReactNode)(item))
          : children}
      </RaListBox>
    </SelectOptions>
  );
});

UnstyledSelectOptions.displayName = "Select.Options";

export const UnstyledSelectOption = forwardRef<
  HTMLDivElement,
  SelectOptionProps
>(({ ...props }, ref) => {
  //return <SelectOption as={RaListBoxItem} ref={ref} {...props} />;
  return (
    <SelectOption asChild ref={ref}>
      <RaListBoxItem {...props} />
    </SelectOption>
  );
});

UnstyledSelectOptions.displayName = "Select.Option";

export const UnstyledSelectOptionGroup = forwardRef<
  HTMLDivElement,
  SelectOptionGroupProps & {
    label: string;
  }
>(({ label, items, children, ...props }, ref) => {
  return (
    <chakra.div asChild ref={ref} {...props}>
      <RaListBoxSection>
        <SelectOptionGroup asChild>
          <RaHeader>{label}</RaHeader>
        </SelectOptionGroup>
        {items
          ? items.map((item) => (children as (item: any) => ReactNode)(item))
          : children}
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
