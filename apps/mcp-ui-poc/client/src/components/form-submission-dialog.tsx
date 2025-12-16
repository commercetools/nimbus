import { Box, Stack, Text, Button, Dialog } from "@commercetools/nimbus";

interface FormSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formData: Record<string, string>;
}

export function FormSubmissionDialog({
  isOpen,
  onClose,
  formData,
}: FormSubmissionDialogProps) {
  return (
    <Dialog.Root
      placement="center"
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Form Submitted</Dialog.Title>
          <Dialog.CloseTrigger onPress={onClose} />
        </Dialog.Header>
        <Dialog.Body>
          <Stack direction="column" gap="300">
            <Text>The form was submitted with the following data:</Text>
            <Box
              padding="400"
              backgroundColor="neutral.2"
              borderRadius="200"
              fontFamily="monospace"
              fontSize="sm"
            >
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {JSON.stringify(formData, null, 2)}
              </pre>
            </Box>
          </Stack>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="solid" colorPalette="primary" onPress={onClose}>
            Close
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
