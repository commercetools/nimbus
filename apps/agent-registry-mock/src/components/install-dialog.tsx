import { useState } from "react";
import { Button, Dialog, RadioInput, Table, Text } from "@commercetools/nimbus";
import type { MockAgent } from "../data/mock-agents";

type InstallScope = "all" | "selected";

interface InstallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  requiredScopes: MockAgent["requiredScopes"];
}

export const InstallDialog = ({
  isOpen,
  onClose,
  onConfirm,
  requiredScopes,
}: InstallDialogProps) => {
  const [installScope, setInstallScope] = useState<InstallScope>("all");

  return (
    <Dialog.Root
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Install agent</Dialog.Title>
          <Dialog.CloseTrigger />
        </Dialog.Header>
        <Dialog.Body>
          <Text mb="300" fontWeight="medium">
            Project scope
          </Text>
          <RadioInput.Root
            name="install-scope"
            value={installScope}
            onChange={(value) => setInstallScope(value as InstallScope)}
            aria-label="Project installation scope"
          >
            <RadioInput.Option value="all">
              Install for all projects of this organization
            </RadioInput.Option>
            <RadioInput.Option value="selected">
              Install for selected projects only
            </RadioInput.Option>
          </RadioInput.Root>

          <Text mt="500" mb="300" fontWeight="medium">
            This agent requires the following permissions
          </Text>
          <Table.Root variant="outline">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Scope</Table.ColumnHeader>
                <Table.ColumnHeader>Description</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {requiredScopes.map((scope) => (
                <Table.Row key={scope.scope}>
                  <Table.Cell>{scope.scope}</Table.Cell>
                  <Table.Cell>{scope.description}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Dialog.Body>
        <Dialog.Footer>
          <Button slot="close" variant="outline">
            Cancel
          </Button>
          <Button variant="solid" colorPalette="primary" onPress={onConfirm}>
            Confirm installation
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};
