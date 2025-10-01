import { useCallback, useId, useRef } from "react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { useIntl } from "react-intl";
import { Select } from "@/components/select";
import { SearchInput } from "@/components/search-input";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { scopedSearchInputSlotRecipe } from "./scoped-search-input.recipe";
import {
  ScopedSearchInputRootSlot,
  ScopedSearchInputContainerSlot,
  ScopedSearchInputSelectWrapperSlot,
  ScopedSearchInputSearchWrapperSlot,
} from "./scoped-search-input.slots";
import type {
  ScopedSearchInputProps,
  ScopedSearchInputOption,
  ScopedSearchInputOptionGroup,
} from "./scoped-search-input.types";
import { isEmpty } from "./utils/helpers";
import messages from "./scoped-search-input.i18n";

export const ScopedSearchInput = (props: ScopedSearchInputProps) => {
  const {
    value,
    onValueChange,
    onTextChange,
    onOptionChange,
    onSubmit,
    onReset,
    options,
    selectPlaceholder,
    searchPlaceholder,
    selectAriaLabel,
    searchAriaLabel,
    isClearable = true,
    isDisabled,
    isReadOnly,
    isInvalid,
    isRequired,
    id,
    "aria-describedby": ariaDescribedby,
    "aria-labelledby": ariaLabelledby,
  } = props;

  const intl = useIntl();

  // Split recipe props
  const recipe = useSlotRecipe({ recipe: scopedSearchInputSlotRecipe });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);

  // Extract style props
  const [styleProps, remainingProps] = extractStyleProps(restRecipeProps);

  // Generate unique IDs for ARIA relationships
  const generatedId = useId();
  const componentId = id || generatedId;
  const selectId = `${componentId}-select`;
  const searchId = `${componentId}-search`;

  // Ref for search input to enable auto-focus on option selection
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Event handlers that coordinate state
  const handleTextChange = useCallback(
    (newText: string) => {
      onTextChange?.(newText);
      onValueChange?.({ ...value, text: newText });
    },
    [value, onTextChange, onValueChange]
  );

  const handleOptionChange = useCallback(
    (newOption: React.Key | null) => {
      if (newOption === null) return;
      const optionString = String(newOption);
      onOptionChange?.(optionString);
      onValueChange?.({ ...value, option: optionString });

      // Auto-focus search input after option selection (unless disabled/readonly)
      if (searchInputRef.current && !isDisabled && !isReadOnly) {
        // Use setTimeout to ensure focus happens after React Aria's state updates
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 0);
      }
    },
    [value, onOptionChange, onValueChange, isDisabled, isReadOnly]
  );

  const handleSubmit = useCallback(() => {
    onSubmit(value);
  }, [value, onSubmit]);

  const handleReset = useCallback(() => {
    onReset?.();
    // Clear text but keep selected option
    handleTextChange("");
  }, [onReset, handleTextChange]);

  // Shared states for both inputs
  const sharedStates = {
    isDisabled,
    isReadOnly,
    isInvalid,
    isRequired,
  };

  return (
    <ScopedSearchInputRootSlot
      {...recipeProps}
      {...styleProps}
      {...remainingProps}
    >
      <ScopedSearchInputContainerSlot>
        {/* Select Dropdown (Left) */}
        <ScopedSearchInputSelectWrapperSlot asChild>
          <Select.Root
            id={selectId}
            selectedKey={value.option}
            onSelectionChange={handleOptionChange}
            placeholder={selectPlaceholder}
            aria-label={
              selectAriaLabel || intl.formatMessage(messages.selectLabel)
            }
            aria-controls={searchId}
            aria-describedby={ariaDescribedby}
            aria-labelledby={ariaLabelledby}
            size={recipeProps.size}
            isClearable={false}
            {...sharedStates}
          >
            <Select.Options>
              {options.map(
                (
                  item: ScopedSearchInputOption | ScopedSearchInputOptionGroup
                ) => {
                  // Check if it's an option group
                  if ("options" in item) {
                    const group = item as ScopedSearchInputOptionGroup;
                    return (
                      <Select.OptionGroup key={group.label} label={group.label}>
                        {group.options.map((opt: ScopedSearchInputOption) => (
                          <Select.Option
                            key={opt.value}
                            id={opt.value}
                            isDisabled={opt.isDisabled}
                          >
                            {opt.label}
                          </Select.Option>
                        ))}
                      </Select.OptionGroup>
                    );
                  }
                  // Regular option
                  const option = item as ScopedSearchInputOption;
                  return (
                    <Select.Option
                      key={option.value}
                      id={option.value}
                      isDisabled={option.isDisabled}
                    >
                      {option.label}
                    </Select.Option>
                  );
                }
              )}
            </Select.Options>
          </Select.Root>
        </ScopedSearchInputSelectWrapperSlot>

        {/* Search Input (Right) */}
        <ScopedSearchInputSearchWrapperSlot asChild>
          <SearchInput
            ref={searchInputRef}
            id={searchId}
            value={value.text}
            onChange={handleTextChange}
            onSubmit={handleSubmit}
            onClear={isClearable ? handleReset : undefined}
            placeholder={searchPlaceholder}
            aria-label={
              searchAriaLabel || intl.formatMessage(messages.searchLabel)
            }
            aria-describedby={ariaDescribedby}
            aria-labelledby={ariaLabelledby}
            size={recipeProps.size}
            {...sharedStates}
          />
        </ScopedSearchInputSearchWrapperSlot>
      </ScopedSearchInputContainerSlot>
    </ScopedSearchInputRootSlot>
  );
};

// Static methods
ScopedSearchInput.isEmpty = isEmpty;

// Display name
ScopedSearchInput.displayName = "ScopedSearchInput";
