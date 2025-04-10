import { type ReactNode } from "react";
import {
  render,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";
import { NimbusProvider } from "@/components";
import { userEvent as baseUserEvent } from "@testing-library/user-event";

const renderWithProvider = (
  ui: ReactNode,
  options?: RenderOptions
): RenderResult => {
  return render(<NimbusProvider>{ui}</NimbusProvider>, options);
};

export * from "@testing-library/react";
export const userEvent = baseUserEvent.setup();
export { act } from "react";
export { renderWithProvider as render };
