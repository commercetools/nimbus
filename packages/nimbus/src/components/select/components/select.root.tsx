import { useRef } from "react";
import { chakra, useSlotRecipe } from "@chakra-ui/react/styled-system";
import { useObjectRef } from "react-aria";
import { extractStyleProps, mergeRefs } from "@/utils";

import {
  KeyboardArrowDown as DropdownIndicatorIcon,
  Loop as SpinnerIcon,
} from "@commercetools/nimbus-icons";

import { Flex, Box } from "@/components";
import {
  Button as RaButton,
  Popover as RaPopover,
  Select as RaSelect,
  SelectValue as RaSelectValue,
} from "react-aria-components";
import {
  SelectRootSlot,
  SelectTriggerSlot,
  SelectTriggerLabelSlot,
  SelectLeadingElementSlot,
} from "./../select.slots";
import { SelectClearButton } from "./select.clear-button";
import { type SelectProps } from "./../select.types";
import { selectSlotRecipe } from "../select.recipe";

/**
 * Select.Root - The root component that provides context and state management for the select
 *
 * @supportsStyleProps
 */
export const SelectRoot = function SelectRoot({
  ref: forwardedRef,
  children,
  leadingElement,
  isLoading,
  isDisabled,
  isClearable = true,
  ...props
}: SelectProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));
  const recipe = useSlotRecipe({ recipe: selectSlotRecipe });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);
  const [styleProps, restProps] = extractStyleProps(restRecipeProps);

  const raSelectProps = {
    ...restProps,
    isDisabled: isLoading || isDisabled,
  };

  return (
    <SelectRootSlot asChild ref={ref} {...recipeProps} {...styleProps}>
      <RaSelect {...raSelectProps}>
        <chakra.div position="relative">
          <SelectTriggerSlot zIndex={0} asChild>
            <RaButton>
              {leadingElement && (
                <SelectLeadingElementSlot asChild>
                  {leadingElement}
                </SelectLeadingElementSlot>
              )}
              <SelectTriggerLabelSlot asChild>
                <RaSelectValue />
              </SelectTriggerLabelSlot>
            </RaButton>
          </SelectTriggerSlot>
          <Flex
            position="absolute"
            top="0"
            bottom="0"
            zIndex={1}
            right="400"
            pointerEvents="none"
          >
            {isClearable && (
              <Flex width="600" my="auto">
                <SelectClearButton />
              </Flex>
            )}

            <Flex my="auto" w="600" h="600">
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
    </SelectRootSlot>
  );
};

SelectRoot.displayName = "Select.Root";
