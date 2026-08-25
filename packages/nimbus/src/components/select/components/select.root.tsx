import { useRef } from "react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { useObjectRef } from "react-aria";
import { AdornmentContent, extractStyleProps, mergeRefs } from "@/utils";

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
  SelectTriggerButtonSlot,
  SelectTriggerLabelSlot,
  SelectLeadingElementSlot,
  SelectTrailingElementSlot,
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
  trailingElement,
  isLoading,
  isDisabled,
  isClearable = true,
  ...props
}: SelectProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));
  // The popover anchors to and is measured from the field container, not the
  // trigger button - the button no longer spans the field, so measuring it would
  // shrink the popover and shift its leading edge.
  const triggerRef = useRef<HTMLDivElement>(null);
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
        <SelectTriggerSlot ref={triggerRef}>
          <SelectTriggerButtonSlot asChild>
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
          </SelectTriggerButtonSlot>

          {trailingElement && (
            <SelectTrailingElementSlot>
              <AdornmentContent>{trailingElement}</AdornmentContent>
            </SelectTrailingElementSlot>
          )}

          {isClearable && (
            <Flex width="600" flexShrink={0}>
              <SelectClearButton isDisabled={isLoading || isDisabled} />
            </Flex>
          )}

          <Flex w="600" h="600" flexShrink={0}>
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
        </SelectTriggerSlot>

        <RaPopover triggerRef={triggerRef}>{children}</RaPopover>
      </RaSelect>
    </SelectRootSlot>
  );
};

SelectRoot.displayName = "Select.Root";
