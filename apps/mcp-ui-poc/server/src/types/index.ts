// Shared types for composable UI elements

export type ChildElement =
  | HeadingChild
  | TextChild
  | ButtonChild
  | BadgeChild
  | StackChild
  | FlexChild
  | CardChild;

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
