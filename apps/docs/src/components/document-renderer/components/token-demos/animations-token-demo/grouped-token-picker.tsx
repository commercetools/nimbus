import { Box, Flex, Stack, Text } from "@commercetools/nimbus";
import { useId, useRef, type KeyboardEvent } from "react";

export interface TokenGroup {
  /** The visible label of the row. */
  label: string;
  tokens: string[];
}

type GroupedTokenPickerProps = {
  /**
   * Accessible name of the whole group. Without it, the label of the first
   * row names the group.
   */
  label?: string;
  /** One row for each group, with its label on the left. */
  groups: TokenGroup[];
  /** The selected token. */
  value: string;
  onChange: (token: string) => void;
};

/**
 * Rows of token chips with a label each, to pick one token from all rows. It
 * looks like the shared `TokenPicker` and works as one radio group: Tab moves
 * into the group, and the arrow keys, Home and End move between all tokens.
 */
export const GroupedTokenPicker = ({
  label,
  groups,
  value,
  onChange,
}: GroupedTokenPickerProps) => {
  const id = useId();
  const tokens = groups.flatMap((group) => group.tokens);
  const chips = useRef<(HTMLElement | null)[]>([]);
  // The chip that Tab moves to: the selected one, or else the first one.
  const focusIndex = Math.max(tokens.indexOf(value), 0);

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

  let offset = 0;
  return (
    <Stack
      role="radiogroup"
      aria-label={label}
      aria-labelledby={label ? undefined : `${id}-0`}
      gap="200"
      onKeyDown={onKeyDown}
    >
      {groups.map((group, groupIndex) => {
        const start = offset;
        offset += group.tokens.length;
        return (
          <Flex
            key={group.label}
            direction={{ base: "column", sm: "row" }}
            align={{ base: "stretch", sm: "baseline" }}
            gap={{ base: "100", sm: "300" }}
          >
            <Text
              id={`${id}-${groupIndex}`}
              flexShrink={0}
              width={{ sm: "2400" }}
              textStyle="sm"
              fontWeight="600"
            >
              {group.label}
            </Text>
            <Flex wrap="wrap" gap="150">
              {group.tokens.map((token, tokenIndex) => {
                const index = start + tokenIndex;
                const isSelected = token === value;
                return (
                  <Box
                    as="button"
                    role="radio"
                    key={token}
                    aria-checked={isSelected}
                    tabIndex={index === focusIndex ? 0 : -1}
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
          </Flex>
        );
      })}
    </Stack>
  );
};
