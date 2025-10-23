import { useRef } from "react";
import { mergeRefs } from "@chakra-ui/react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { useObjectRef } from "react-aria";
import {
  SearchField as RaSearchField,
  Input as RaInput,
} from "react-aria-components";
import { useIntl } from "react-intl";
import { Search, Close } from "@commercetools/nimbus-icons";
import { IconButton } from "@/components";
import { extractStyleProps } from "@/utils";
import { searchInputSlotRecipe } from "./search-input.recipe";
import {
  SearchInputRootSlot,
  SearchInputLeadingElementSlot,
  SearchInputInputSlot,
} from "./search-input.slots";
import type { SearchInputProps } from "./search-input.types";
import messages from "./search-input.i18n";

/**
 * # SearchInput
 *
 * A search input component that allows users to enter search queries with built-in
 * clear functionality. Built on React Aria's SearchField for accessibility.
 */
export const SearchInput = (props: SearchInputProps) => {
  const { ref: forwardedRef, ...restProps } = props;

  const intl = useIntl();
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
      {({ state }) => (
        <SearchInputRootSlot {...recipeProps} {...styleProps} {...stateProps}>
          <SearchInputLeadingElementSlot>
            <Search />
          </SearchInputLeadingElementSlot>
          <SearchInputInputSlot asChild>
            <RaInput ref={ref} />
          </SearchInputInputSlot>
          <IconButton
            slot="null"
            size="2xs"
            variant="ghost"
            tone="primary"
            aria-label={intl.formatMessage(messages.clearInput)}
            onPress={() => state.setValue("")}
            opacity={state.value ? 1 : 0}
            pointerEvents={state.value ? "auto" : "none"}
            isDisabled={props.isDisabled || props.isReadOnly}
          >
            <Close />
          </IconButton>
        </SearchInputRootSlot>
      )}
    </RaSearchField>
  );
};

SearchInput.displayName = "SearchInput";
