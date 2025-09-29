import { useRef } from "react";
import { mergeRefs } from "@chakra-ui/react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { useObjectRef } from "react-aria";
import {
  SearchField as RaSearchField,
  Input as RaInput,
  Button as RaButton,
} from "react-aria-components";
import { Search, Close } from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { searchInputSlotRecipe } from "./search-input.recipe";
import {
  SearchInputRootSlot,
  SearchInputLeadingElementSlot,
  SearchInputInputSlot,
  SearchInputClearButtonSlot,
} from "./search-input.slots";
import type { SearchInputProps } from "./search-input.types";

/**
 * # SearchInput
 *
 * A search input component that allows users to enter search queries with built-in
 * clear functionality. Built on React Aria's SearchField for accessibility.
 */
export const SearchInput = (props: SearchInputProps) => {
  const { ref: forwardedRef, ...restProps } = props;

  const recipe = useSlotRecipe({ recipe: searchInputSlotRecipe });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(restProps);

  const localRef = useRef<HTMLInputElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const [styleProps, functionalProps] = extractStyleProps(remainingProps);

  const stateProps = {
    "data-disabled": props.isDisabled ? "true" : undefined,
    "data-invalid": props.isInvalid ? "true" : "false",
  };

  return (
    <RaSearchField {...functionalProps}>
      <SearchInputRootSlot {...recipeProps} {...styleProps} {...stateProps}>
        <SearchInputLeadingElementSlot>
          <Search />
        </SearchInputLeadingElementSlot>
        <SearchInputInputSlot asChild>
          <RaInput ref={ref} />
        </SearchInputInputSlot>
        <SearchInputClearButtonSlot asChild>
          <RaButton>
            <Close />
          </RaButton>
        </SearchInputClearButtonSlot>
      </SearchInputRootSlot>
    </RaSearchField>
  );
};

SearchInput.displayName = "SearchInput";
