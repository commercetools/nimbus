import type { Ref } from "react";
import type { AutocompleteProps as RaAutocompleteProps } from "react-aria-components/Autocomplete";

export type AutocompleteProps<T = object> = RaAutocompleteProps<T> & {
  ref?: Ref<HTMLDivElement>;
};
