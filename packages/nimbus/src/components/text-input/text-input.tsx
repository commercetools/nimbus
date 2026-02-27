import { useEffect, useMemo, useRef, type Context } from "react";
import { mergeRefs } from "@/utils";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import {
  useObjectRef,
  useTextField,
  type AriaTextFieldOptions,
  mergeProps,
} from "react-aria";
import { Input, InputContext, useSlottedContext } from "react-aria-components";
import { extractStyleProps } from "@/utils";
import { textInputSlotRecipe } from "./text-input.recipe";
import {
  TextInputRootSlot,
  TextInputLeadingElementSlot,
  TextInputInputSlot,
  TextInputTrailingElementSlot,
} from "./text-input.slots";
import type { TextInputProps, TextInputContextValue } from "./text-input.types";

const TextInputComponent = (props: TextInputProps) => {
  const {
    leadingElement,
    trailingElement,
    ref: forwardedRef,
    ...restProps
  } = props;

  const recipe = useSlotRecipe({ recipe: textInputSlotRecipe });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(restProps);

  const rootRef = useRef<HTMLDivElement>(null);
  const localRef = useRef<HTMLInputElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const [styleProps, otherProps] = extractStyleProps(remainingProps);

  /**
   * Consume InputContext to support TextInput as a child of React Aria components
   * (e.g., TextField, SearchField, Form). useSlottedContext respects the `slot`
   * prop for proper nesting. Context may contain either React Aria props or DOM
   * attributes depending on the parent component.
   *
   * Note: We use useSlottedContext (not useContextProps) to read context and
   * manually normalize DOM attributes → React Aria props, ensuring type safety
   * with TextInputContextValue and support for both prop styles from parents.
   */
  const inputContext = useSlottedContext(
    InputContext
  ) as TextInputContextValue | null;

  /**
   * Normalize context props: convert any DOM attributes (disabled, required)
   * to React Aria props (isDisabled, isRequired) since React Aria's useTextField
   * hook expects the latter. Remove DOM attributes to prevent React warnings.
   */
  const normalizedInputContext = useMemo(
    () => ({
      ...inputContext,
      isDisabled: inputContext?.isDisabled ?? inputContext?.disabled,
      isRequired: inputContext?.isRequired ?? inputContext?.required,
      isReadOnly: inputContext?.isReadOnly ?? inputContext?.readOnly,
      // Explicit boolean coercion for aria-invalid: "false" string is truthy!
      isInvalid:
        inputContext?.isInvalid ??
        (inputContext?.["aria-invalid"] === true ||
        inputContext?.["aria-invalid"] === "true"
          ? true
          : inputContext?.["aria-invalid"] === false ||
              inputContext?.["aria-invalid"] === "false"
            ? false
            : undefined),
      disabled: undefined,
      required: undefined,
      readOnly: undefined,
    }),
    [inputContext]
  );

  // Merge context with component props (component props take precedence)
  const inputFieldProps = mergeProps(normalizedInputContext, otherProps);

  /**
   * useTextField converts React Aria props to DOM attributes with proper ARIA
   * annotations (isDisabled → disabled, isRequired → aria-required, etc.)
   */
  const { inputProps } = useTextField(
    inputFieldProps as AriaTextFieldOptions<"input">,
    ref
  );

  const stateProps = {
    "data-disabled": inputProps.disabled ? "true" : undefined,
    "data-invalid": inputProps["aria-invalid"] ? "true" : "false",
  };

  // Using a useEffect instead of "onClick" on the element, to preserve
  // the `onClick` prop for consumers.
  useEffect(() => {
    const handleRootClick = (event: MouseEvent) => {
      // Only focus if the click is inside the root element,
      // not on the input itself, and not on an interactive element
      if (
        rootRef.current &&
        rootRef.current.contains(event.target as Node) &&
        localRef.current &&
        event.target !== localRef.current
      ) {
        localRef.current.focus();
      }
    };
    document.addEventListener("click", handleRootClick);
    return () => {
      document.removeEventListener("click", handleRootClick);
    };
  }, []);

  return (
    <InputContext.Provider value={null}>
      <TextInputRootSlot
        ref={rootRef}
        className={props?.className as string}
        {...recipeProps}
        {...styleProps}
        {...stateProps}
      >
        {leadingElement && (
          <TextInputLeadingElementSlot>
            {leadingElement}
          </TextInputLeadingElementSlot>
        )}
        <TextInputInputSlot asChild>
          <Input ref={ref} {...inputProps} />
        </TextInputInputSlot>
        {trailingElement && (
          <TextInputTrailingElementSlot>
            {trailingElement}
          </TextInputTrailingElementSlot>
        )}
      </TextInputRootSlot>
    </InputContext.Provider>
  );
};

TextInputComponent.displayName = "TextInput";

/**
 * ### TextInput
 *
 * An input component that takes in text as input
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/textinput}
 */
export const TextInput: typeof TextInputComponent & {
  // TypeScript can't properly name the internal React Aria types when inferring
  // TextInput.Context, so we explicitly type it using typeof and Object.assign
  /**
   * ### TextInput.Context
   *
   * Re-exports React-Aria's `InputContext` with extended type support
   *
   * Accepts both React Aria props (isDisabled, isRequired, etc.) and
   * DOM attributes (disabled, required, etc.) for maximum flexibility.
   *
   * For advanced use cases, **you generally will not need this**
   *
   * @see {@link https://react-spectrum.adobe.com/react-aria/advanced.html#contexts}
   * @see {@link https://react-spectrum.adobe.com/react-aria/TextField.html#custom-children}
   */
  Context: Context<TextInputContextValue | null>;
} = Object.assign(TextInputComponent, {
  Context: InputContext as Context<TextInputContextValue | null>,
});
