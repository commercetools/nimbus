// Shared types for composable UI elements

export type ChildElement =
  | HeadingChild
  | TextChild
  | ButtonChild
  | BadgeChild
  | StackChild
  | FlexChild
  | CardChild
  | FormFieldChild
  | TextInputChild
  | MoneyInputChild;

export interface HeadingChild {
  type: "heading";
  content: string;
  size?: string;
  marginBottom?: string;
}

export interface TextChild {
  type: "text";
  content: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  marginBottom?: string;
}

export interface ButtonChild {
  type: "button";
  label: string;
  variant?: string;
  colorPalette?: string;
  width?: string;
  isDisabled?: boolean;
  ariaLabel?: string;
}

export interface BadgeChild {
  type: "badge";
  label: string;
  colorPalette?: string;
  size?: string;
  width?: string;
}

export interface StackChild {
  type: "stack";
  direction?: string;
  gap?: string;
  width?: string;
  marginBottom?: string;
  children?: ChildElement[];
}

export interface FlexChild {
  type: "flex";
  direction?: string;
  gap?: string;
  padding?: string;
  backgroundColor?: string;
  children?: ChildElement[];
}

export interface CardChild {
  type: "card";
  elevation?: string;
  borderStyle?: string;
  cardPadding?: string;
  maxWidth?: string;
  width?: string;
  children?: ChildElement[];
}

export interface FormFieldChild {
  type: "formField";
  labelChildren: ChildElement[];
  inputChildren: ChildElement[];
  description?: string;
  errorMessage?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  size?: string;
  direction?: string;
}

export interface TextInputChild {
  type: "textInput";
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  inputType?: string;
  ariaLabel?: string;
}

export interface MoneyInputChild {
  type: "moneyInput";
  name?: string;
  currencyCode?: string;
  amount?: string;
  currencies?: string[];
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  size?: "sm" | "md";
  hasHighPrecisionBadge?: boolean;
  isCurrencyInputDisabled?: boolean;
  ariaLabel?: string;
}
