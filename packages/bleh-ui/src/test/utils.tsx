import { type ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { UiKitProvider } from "@/components";
import { userEvent as baseUserEvent } from "@testing-library/user-event";

const renderWithProvider = (ui: ReactNode, options?: RenderOptions) => {
  return render(<UiKitProvider>{ui}</UiKitProvider>, options);
};

export * from "@testing-library/react";
export const userEvent = baseUserEvent.setup();
export { renderWithProvider as render };
