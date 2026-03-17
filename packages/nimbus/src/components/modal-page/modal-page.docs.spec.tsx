import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NimbusProvider } from "@commercetools/nimbus";
import { ModalPage } from "@commercetools/nimbus";

describe("ModalPage", () => {
  it("renders a modal page with title and content", () => {
    render(
      <NimbusProvider>
        <ModalPage.Root isOpen onClose={() => {}}>
          <ModalPage.TopBar
            previousPathLabel="Products"
            currentPathLabel="Edit Product"
          />
          <ModalPage.Header>
            <ModalPage.Title
              title="Edit Product"
              subtitle="Update the product details"
            />
          </ModalPage.Header>
          <ModalPage.Content>
            <p>Product form content</p>
          </ModalPage.Content>
          <ModalPage.Footer>
            <button type="button">Cancel</button>
            <button type="button">Save</button>
          </ModalPage.Footer>
        </ModalPage.Root>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("heading", { name: "Edit Product" })
    ).toBeInTheDocument();
    expect(screen.getByText("Update the product details")).toBeInTheDocument();
    expect(screen.getByText("Product form content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });
});
