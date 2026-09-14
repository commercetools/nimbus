import { useEffect, useMemo, useState, useRef } from "react";
import type { FormFieldProps } from "../form-field.types";
import { useField, useObjectRef } from "react-aria";
import { mergeRefs } from "@/utils";
import {
  FormFieldContext,
  type FormFieldContextPayloadType,
} from "./form-field.context";
import {
  FormFieldDescriptionSlot,
  FormFieldErrorSlot,
  FormFieldLabelSlot,
  FormFieldPopoverSlot,
  FormFieldRootSlot,
} from "../form-field.slots";
import { Dialog, DialogTrigger, Popover } from "react-aria-components";
import { Box, IconButton } from "@/components";
import { ErrorOutline, HelpOutline } from "@commercetools/nimbus-icons";

/**
 * # FormField.Root
 *
 * displays miscellaneous inputs in a FormField context
 *
 * @supportsStyleProps
 */
export const FormFieldRoot = function FormFieldRoot({
  ref: forwardedRef,
  id,
  isInvalid,
  isRequired,
  isDisabled,
  isReadOnly,
  children,
  ...props
}: FormFieldProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));
  const [context, setContext] = useState<FormFieldContextPayloadType>({
    label: null,
    description: null,
    error: null,
    info: null,
    isInvalid,
    isRequired,
    isDisabled,
    isReadOnly,
  });

  const useFieldArgs: Parameters<typeof useField>[0] = useMemo(() => {
    const args: Parameters<typeof useField>[0] = {
      id,
      description: context.description,
      errorMessage: context.error,
    };

    if (context.label) {
      args.label = context.label;
    } else {
      // Context will always start out null, so we need to stub out some aria attributes
      // FIXME: This is a hack to get the form field to work, but it's not the best solution
      // FIXME: We should find a better way to handle this by redesigning the FormField component's structure
      args["aria-label"] = "empty-label";
      args["aria-labelledby"] = "empty-label";
    }

    return args;
  }, [id, context.description, context.error, context.label]);

  const { labelProps, fieldProps, descriptionProps, errorMessageProps } =
    useField(useFieldArgs);

  useEffect(() => {
    setContext((prevContext) => ({
      ...prevContext,
      isInvalid,
      isRequired,
      isDisabled,
      isReadOnly,
    }));
  }, [isInvalid, isRequired, isDisabled, isReadOnly]);

  const inputProps = useMemo(
    () => ({
      ...fieldProps,
      isInvalid,
      isRequired,
      isDisabled,
      isReadOnly,
    }),
    [fieldProps, isInvalid, isRequired, isDisabled, isReadOnly]
  );

  const contextValue = useMemo(
    () => ({ context, setContext, inputProps }),
    [context, inputProps]
  );

  return (
    <FormFieldContext.Provider value={contextValue}>
      <FormFieldRootSlot ref={ref} {...props}>
        {context.label && (
          <FormFieldLabelSlot {...context.labelSlotProps}>
            <label {...labelProps} data-required={isRequired}>
              {context.label}
              {isRequired && <sup aria-hidden="true">*</sup>}
            </label>
            {/**
             * The info affordance is a `1ch` square placeholder on the label's
             * line box, with the 24px icon-button absolutely centered inside it
             * so it cannot grow the label row.
             *
             * `verticalAlign="middle"` anchors that placeholder's midpoint to
             * the label text's optical center (baseline + half the x-height).
             * Without it the placeholder sits at the default `baseline`, which
             * puts the icon's center half a `ch` above the baseline - close to
             * the right spot for the current font, but only by coincidence,
             * since `ch` is the advance width of "0" and has nothing to do with
             * the text's x-height. The icon would drift with any font change.
             *
             * This stays inline-level on purpose: the label slot is a plain
             * block, so the label text keeps wrapping around the icon and the
             * label's grid track keeps sizing exactly as it does today.
             */}
            {context.info && (
              <DialogTrigger>
                <Box
                  as="span"
                  display="inline-block"
                  verticalAlign="middle"
                  position="relative"
                  width="1ch"
                  height="1ch"
                  ml="200"
                >
                  <Box
                    as="span"
                    display="inline-flex"
                    position="absolute"
                    top="50%"
                    right="50%"
                    transform="translate(50%, -50%)"
                  >
                    <IconButton
                      aria-label="__MORE INFO"
                      size="2xs"
                      colorPalette="info"
                      variant="link"
                    >
                      <HelpOutline />
                    </IconButton>
                  </Box>
                </Box>
                <Popover>
                  <FormFieldPopoverSlot asChild>
                    <Dialog>
                      <Box p="300">{context.info}</Box>
                    </Dialog>
                  </FormFieldPopoverSlot>
                </Popover>
              </DialogTrigger>
            )}
          </FormFieldLabelSlot>
        )}
        {context.description && (
          <FormFieldDescriptionSlot
            {...descriptionProps}
            {...context.descriptionSlotProps}
          >
            {context.description}
          </FormFieldDescriptionSlot>
        )}
        {isInvalid && context.error && (
          <FormFieldErrorSlot
            {...errorMessageProps}
            {...context.errorSlotProps}
          >
            <Box
              as={ErrorOutline}
              display="inline-flex"
              boxSize="400"
              flexShrink="0"
              mt="50"
            />
            {context.error}
          </FormFieldErrorSlot>
        )}
        {children}
      </FormFieldRootSlot>
    </FormFieldContext.Provider>
  );
};

FormFieldRoot.displayName = "FormField.Root";
