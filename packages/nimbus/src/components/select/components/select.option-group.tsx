import { type ReactNode } from "react";
import { extractStyleProps } from "@/utils";
import { chakra } from "@chakra-ui/react/styled-system";
import {
  ListBoxSection as RaListBoxSection,
  Header as RaHeader,
  Collection,
} from "react-aria-components";
import { SelectOptionGroupSlot } from "./../select.slots";
import type { SelectOptionGroupProps } from "../select.types";

/**
 * Select.OptionGroup - A container for grouping related options with an optional label
 *
 * @supportsStyleProps
 */
export const SelectOptionGroup = <T extends object>(
  props: SelectOptionGroupProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => {
  const { ref, label, items, children, ...restProps } = props;
  const [styleProps, functionalProps] = extractStyleProps(restProps);

  // Validate that children is a function when items is provided
  if (items && typeof children !== "function") {
    throw new Error(
      'SelectOptionGroup: When "items" is provided, "children" must be a function'
    );
  }

  return (
    <chakra.section {...styleProps} asChild>
      <RaListBoxSection ref={ref} {...functionalProps}>
        <SelectOptionGroupSlot asChild>
          <RaHeader>{label}</RaHeader>
        </SelectOptionGroupSlot>

        {items ? (
          <Collection items={items}>
            {(item: T) => {
              if (typeof children === "function") {
                return children(item);
              }
              return null;
            }}
          </Collection>
        ) : (
          (children as ReactNode)
        )}
      </RaListBoxSection>
    </chakra.section>
  );
};

SelectOptionGroup.displayName = "Select.OptionGroup";
