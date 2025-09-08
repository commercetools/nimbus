import { useCallback } from "react";
import { Select } from "@/components";
import { MoneyInputCurrencySelectSlot } from "../money-input.slots";
import { useMoneyInputContext } from "../money-input-context";
import type { MoneyInputCurrencySelectProps } from "../money-input.types";
import type { TCurrencyCode } from "../utils";

export const MoneyInputCurrencySelect = ({
  menuPortalTarget,
  menuPortalZIndex = 1,
  menuShouldBlockScroll,
}: MoneyInputCurrencySelectProps = {}) => {
  const context = useMoneyInputContext();
  const {
    value,
    currencies,
    handleCurrencyChange,
    handleCurrencyFocus,
    handleCurrencyBlur,
    getCurrencyDropdownId,
    getCurrencyDropdownName,
    hasNoCurrencies,
    isDisabled,
    isCurrencyInputDisabled,
    isReadOnly,
  } = context;

  const handleSelectionChange = useCallback(
    (selectedKey: string | number | null) => {
      if (selectedKey && typeof selectedKey === "string") {
        handleCurrencyChange(selectedKey as TCurrencyCode);
      }
    },
    [handleCurrencyChange]
  );

  // If no currencies provided, render a label instead of dropdown
  if (hasNoCurrencies) {
    return (
      <MoneyInputCurrencySelectSlot data-testid="currency-label">
        <label htmlFor={`${context.id}-amount`}>{value.currencyCode}</label>
      </MoneyInputCurrencySelectSlot>
    );
  }

  return (
    <MoneyInputCurrencySelectSlot data-testid="currency-dropdown">
      <Select.Root
        selectedKey={value.currencyCode || null}
        onSelectionChange={handleSelectionChange}
        onFocus={handleCurrencyFocus}
        onBlur={handleCurrencyBlur}
        isDisabled={isCurrencyInputDisabled || isDisabled || isReadOnly}
        isClearable={false}
        placeholder=""
        aria-label="Currency selection"
      >
        <Select.Options>
          {currencies.map((currencyCode) => (
            <Select.Option key={currencyCode} id={currencyCode}>
              {currencyCode}
            </Select.Option>
          ))}
        </Select.Options>
      </Select.Root>
    </MoneyInputCurrencySelectSlot>
  );
};
