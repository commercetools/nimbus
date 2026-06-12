import { Autocomplete as RaAutocomplete } from "react-aria-components/Autocomplete";
import type { AutocompleteProps } from "./autocomplete.types";

export { useFilter } from "react-aria-components/Autocomplete";

export const Autocomplete = <T extends object>(props: AutocompleteProps<T>) => {
  return <RaAutocomplete {...props} />;
};

Autocomplete.displayName = "Autocomplete";
