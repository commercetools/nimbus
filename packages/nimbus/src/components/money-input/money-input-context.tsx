import { createContext, useContext, type ReactNode } from "react";
import type { TValue, TCurrencyCode } from "./utils";

type TCustomEvent = {
  target: {
    id?: string;
    name?: string;
    value?: string | string[] | null;
  };
  persist?: () => void;
};

export interface MoneyInputContextValue {
  // Core state
  id: string;
  name?: string;
  value: TValue;
  currencies: string[];

  // Event handlers
  onChange?: (event: TCustomEvent) => void;
  onFocus?: (event: TCustomEvent) => void;
  onBlur?: (event: TCustomEvent) => void;

  // Internal event handlers
  handleAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAmountFocus: () => void;
  handleAmountBlur: () => void;
  handleCurrencyChange: (currencyCode: TCurrencyCode) => void;
  handleCurrencyFocus: () => void;
  handleCurrencyBlur: () => void;
  handleContainerBlur: (event: React.FocusEvent) => void;

  // State flags
  currencyHasFocus: boolean;
  amountHasFocus: boolean;
  hasFocus: boolean;
  hasNoCurrencies: boolean;

  // Component props
  isDisabled?: boolean;
  isReadOnly?: boolean;
  hasError?: boolean;
  hasWarning?: boolean;
  isCondensed?: boolean;
  hasHighPrecisionBadge?: boolean;
  isCurrencyInputDisabled?: boolean;

  // High precision
  isHighPrecision: boolean;

  // Helper functions
  getAmountInputId: () => string;
  getCurrencyDropdownId: () => string;
  getAmountInputName: () => string | undefined;
  getCurrencyDropdownName: () => string | undefined;
}

const MoneyInputContext = createContext<MoneyInputContextValue | null>(null);

export const useMoneyInputContext = () => {
  const context = useContext(MoneyInputContext);
  if (!context) {
    throw new Error(
      "useMoneyInputContext must be used within a MoneyInput.Root"
    );
  }
  return context;
};

export const MoneyInputProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: MoneyInputContextValue;
}) => (
  <MoneyInputContext.Provider value={value}>
    {children}
  </MoneyInputContext.Provider>
);
