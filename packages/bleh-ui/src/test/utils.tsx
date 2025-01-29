import { type ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { UiKitProvider } from "@/components";

const renderWithProvider = (ui: ReactNode, options?: RenderOptions) => {
  return render(<UiKitProvider>{ui}</UiKitProvider>, options);
};

export * from "@testing-library/react";
export { renderWithProvider as render };
