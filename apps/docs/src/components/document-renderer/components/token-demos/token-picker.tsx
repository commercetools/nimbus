import { Box, Flex } from "@commercetools/nimbus";
import { useRef, type KeyboardEvent } from "react";

type TokenPickerProps = {
  /** Accessible name of the group, such as "Spacing token". */
  label: string;
  tokens: string[];
  /** The selected token. */
  value: string;
  onChange: (token: string) => void;
};

/**
 * A row of token chips to pick one token from. It works as a radio group: Tab
 * moves into the group, and the arrow keys, Home and End move between tokens.
 */
export const TokenPicker = ({
  label,
  tokens,
  value,
  onChange,
}: TokenPickerProps) => {
  const chips = useRef<(HTMLElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent) => {
    const last = tokens.length - 1;
    const index = tokens.indexOf(value);
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? index <= 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : -1;
    if (next < 0) return;
    event.preventDefault();
    onChange(tokens[next]);
    chips.current[next]?.focus();
  };

  return (
    <Flex
      role="radiogroup"
      aria-label={label}
      wrap="wrap"
      gap="150"
      onKeyDown={onKeyDown}
    >
      {tokens.map((token, index) => {
        const isSelected = token === value;
        return (
          <Box
            as="button"
            role="radio"
            key={token}
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            ref={(element: HTMLDivElement | null) => {
              chips.current[index] = element;
            }}
            onClick={() => onChange(token)}
            px="200"
            py="50"
            borderRadius="200"
            border="1px solid"
            borderColor={isSelected ? "primary.9" : "neutral.6"}
            bg={isSelected ? "primary.3" : "transparent"}
            fontFamily="mono"
            textStyle="sm"
            cursor="pointer"
            _hover={{ bg: isSelected ? "primary.3" : "neutral.2" }}
            _focusVisible={{
              outline: "2px solid",
              outlineColor: "primary.9",
              outlineOffset: "2px",
            }}
          >
            {token}
          </Box>
        );
      })}
    </Flex>
  );
};
