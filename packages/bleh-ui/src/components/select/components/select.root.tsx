import { forwardRef } from "react";
import { chakra, useSlotRecipe } from "@chakra-ui/react";
import {
  ChevronDown as DropdownIndicatorIcon,
  LoaderCircle as SpinnerIcon,
} from "@bleh-ui/icons";

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
} from "./../select.slots";
import { SelectClearButton } from "./select.clear-button";
import { type SelectRootProps } from "./../select.types";
import { selectSlotRecipe } from "../select.recipe";

export const SelectRoot = forwardRef<HTMLDivElement, SelectRootProps>(
  ({ children, isLoading, isDisabled, ...props }, ref) => {
    const recipe = useSlotRecipe({ recipe: selectSlotRecipe });
    const [recipeProps, restProps] = recipe.splitVariantProps(props);

    const raSelectProps = {
      ...restProps,
      isDisabled: isLoading || isDisabled,
    };

    return (
      <SelectRootSlot asChild ref={ref} {...recipeProps}>
        <RaSelect {...raSelectProps}>
          <chakra.div position="relative">
            <SelectTriggerSlot zIndex={0} asChild>
              <RaButton>
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
      </SelectRootSlot>
    );
  }
);

SelectRoot.displayName = "Select.Root";
