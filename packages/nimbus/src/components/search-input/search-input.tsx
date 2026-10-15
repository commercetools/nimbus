import { useRef } from "react";
import { mergeRefs } from "@/utils";
import { chakra, useSlotRecipe } from "@chakra-ui/react/styled-system";
import { useObjectRef } from "react-aria";
import {
  SearchField as RaSearchField,
  Input as RaInput,
} from "react-aria-components";
import { Search, Close } from "@commercetools/nimbus-icons";
import { IconButton } from "@/components";
import { AdornmentContent, extractStyleProps } from "@/utils";
import {
  useLocalizedStringFormatter,
  useFocusInputOnFieldClick,
} from "@/hooks";
import { searchInputSlotRecipe } from "./search-input.recipe";
import {
  SearchInputRootSlot,
  SearchInputLeadingElementSlot,
  SearchInputTrailingElementSlot,
  SearchInputInputWrapperSlot,
  SearchInputInputSlot,
} from "./search-input.slots";
import type { SearchInputProps } from "./search-input.types";
import { searchInputMessagesStrings } from "./search-input.messages";

/**
 * # SearchInput
 *
 * A search input component that allows users to enter search queries with built-in
 * clear functionality. Built on React Aria's SearchField for accessibility.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/search-input}
 * @supportsStyleProps
 */
export const SearchInput = (props: SearchInputProps) => {
  const {
    ref: forwardedRef,
    leadingElement = <Search />,
    trailingElement,
    ...restProps
  } = props;

  const msg = useLocalizedStringFormatter(searchInputMessagesStrings);
  const recipe = useSlotRecipe({ recipe: searchInputSlotRecipe });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(restProps);

  const rootRef = useRef<HTMLDivElement>(null);
  const localRef = useRef<HTMLInputElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const [styleProps, functionalProps] = extractStyleProps(remainingProps);

  const stateProps = {
    "data-disabled": props.isDisabled ? "true" : undefined,
    "data-invalid": props.isInvalid ? "true" : "false",
  };

  // Clicking the field chrome (search icon, padding, empty space) focuses the input.
  useFocusInputOnFieldClick(rootRef, localRef);

  return (
    // Collapse the React Aria <SearchField> wrapper so the inline-flex root is
    // the layout box, sizing like the other inputs.
    <chakra.div display="contents" asChild>
      <RaSearchField {...functionalProps}>
        {({ state, isEmpty }) => (
          <SearchInputRootSlot
            ref={rootRef}
            {...recipeProps}
            {...styleProps}
            {...stateProps}
            data-empty={isEmpty ? "true" : undefined}
          >
            {leadingElement && (
              <SearchInputLeadingElementSlot>
                <AdornmentContent>{leadingElement}</AdornmentContent>
              </SearchInputLeadingElementSlot>
            )}
            {/* While empty, holds the clear button's space for the input to
                use, so the field keeps its width (see the recipe). */}
            <SearchInputInputWrapperSlot>
              <SearchInputInputSlot asChild>
                <RaInput ref={ref} />
              </SearchInputInputSlot>
            </SearchInputInputWrapperSlot>
            {trailingElement && (
              <SearchInputTrailingElementSlot>
                <AdornmentContent>{trailingElement}</AdornmentContent>
              </SearchInputTrailingElementSlot>
            )}
            {/* Not rendered while empty, so a trailingElement sits at the
                field's trailing edge. */}
            {!isEmpty && (
              <IconButton
                slot="null"
                size="2xs"
                variant="ghost"
                colorPalette="primary"
                aria-label={msg.format("clearInput")}
                onPress={() => state.setValue("")}
                isDisabled={props.isDisabled || props.isReadOnly}
              >
                <Close />
              </IconButton>
            )}
          </SearchInputRootSlot>
        )}
      </RaSearchField>
    </chakra.div>
  );
};

SearchInput.displayName = "SearchInput";
