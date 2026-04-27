import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import {
  Badge,
  Flex,
  InfoDialog,
  NimbusProvider,
  Text,
} from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering
 * @docs-description Verify the InfoDialog opens and renders its title and content.
 * @docs-order 1
 */
describe("InfoDialog - Basic rendering", () => {
  it("renders title and children when isOpen is true", () => {
    render(
      <NimbusProvider>
        <InfoDialog title="Heads up" isOpen>
          <p>Something you should know.</p>
        </InfoDialog>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("heading", { name: "Heads up" })
    ).toBeInTheDocument();
    expect(screen.getByText("Something you should know.")).toBeInTheDocument();
  });

  it("uses the string title as the dialog's accessible name", () => {
    render(
      <NimbusProvider>
        <InfoDialog title="Account details" isOpen>
          <p>Body</p>
        </InfoDialog>
      </NimbusProvider>
    );

    expect(screen.getByRole("dialog")).toHaveAccessibleName("Account details");
  });

  it("does not render the dialog when isOpen is false", () => {
    render(
      <NimbusProvider>
        <InfoDialog title="Hidden" isOpen={false}>
          <p>Not visible</p>
        </InfoDialog>
      </NimbusProvider>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

/**
 * @docs-section controlled-state
 * @docs-title Controlled Open State
 * @docs-description Drive the InfoDialog from consumer state via isOpen and onOpenChange.
 * @docs-order 2
 */
describe("InfoDialog - Controlled state", () => {
  it("invokes onOpenChange(false) when the close button is clicked", async () => {
    const user = userEvent.setup();

    const ControlledInfoDialog = () => {
      const [isOpen, setIsOpen] = useState(true);
      return (
        <InfoDialog title="Close me" isOpen={isOpen} onOpenChange={setIsOpen}>
          <p>Dismissable content</p>
        </InfoDialog>
      );
    };

    render(
      <NimbusProvider>
        <ControlledInfoDialog />
      </NimbusProvider>
    );

    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /close/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});

/**
 * @docs-section uncontrolled-state
 * @docs-title Uncontrolled Open State
 * @docs-description Open the InfoDialog by default without managing state via defaultOpen.
 * @docs-order 3
 */
describe("InfoDialog - Uncontrolled state", () => {
  it("opens by default in uncontrolled mode via defaultOpen", () => {
    render(
      <NimbusProvider>
        <InfoDialog title="Welcome" defaultOpen>
          <p>Shown immediately on mount.</p>
        </InfoDialog>
      </NimbusProvider>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Shown immediately on mount.")).toBeInTheDocument();
  });
});

/**
 * @docs-section accessible-name-override
 * @docs-title Accessible Name Override
 * @docs-description Provide an explicit aria-label when a composed ReactNode title does not form a meaningful accessible name.
 * @docs-order 4
 */
describe("InfoDialog - Accessible name override", () => {
  it("uses aria-label as the accessible name when provided", () => {
    render(
      <NimbusProvider>
        <InfoDialog
          title={
            <Flex alignItems="center" gap="200">
              <Text>Plan details</Text>
              <Badge>Pro</Badge>
            </Flex>
          }
          aria-label="Plan details"
          isOpen
        >
          <p>Your current plan includes unlimited projects.</p>
        </InfoDialog>
      </NimbusProvider>
    );

    expect(screen.getByRole("dialog")).toHaveAccessibleName("Plan details");
  });
});
