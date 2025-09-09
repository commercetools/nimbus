import { Info, Add } from "@commercetools/nimbus-icons";
import { Button, Dialog, TextInput, Stack, Text } from "@commercetools/nimbus";
import { useCreateDocument } from "@/hooks/useCreateDocument";

/**
 * Component for creating a new document from the navigation bar.
 */
export const AppNavBarCreateButton = () => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    menuLabel,
    setMenuLabel,
    isOpen,
    setIsOpen,
    isLoading,
    isFormValid,
    handleSubmit,
  } = useCreateDocument();

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button colorPalette="primary" size="xs" variant="ghost">
          <Add />
          New document
        </Button>
      </Dialog.Trigger>
      <Dialog.Content divideY="1px">
        <Dialog.Backdrop />
        <Dialog.Header>
          <Dialog.Title>Create New Document</Dialog.Title>
          <Dialog.Description>
            Fill in the details to create a new document.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          {!isLoading ? (
            <Stack gap="400" mt="400">
              <Stack>
                <Text asChild fontWeight="600">
                  <label htmlFor="title">Title</label>
                </Text>
                <TextInput
                  id="title"
                  value={title}
                  onChange={(value) => setTitle(value)}
                  placeholder="Keep it short, you're busy."
                  autoComplete="off"
                  data-form-type="other"
                />
              </Stack>
              <Stack>
                <Text asChild fontWeight="600">
                  <label htmlFor="description">Description</label>
                </Text>
                <TextInput
                  id="description"
                  value={description}
                  onChange={(value) => setDescription(value)}
                  placeholder="Just enough to make it intriguing"
                  autoComplete="off"
                />
              </Stack>
              <Stack>
                <Text asChild fontWeight="600">
                  <label htmlFor="menuLabel">Menu Label</label>
                </Text>
                <TextInput
                  id="menuLabel"
                  value={menuLabel}
                  onChange={(value) => setMenuLabel(value)}
                  placeholder="What people will click, no pressure."
                  autoComplete="off"
                />
                <Stack
                  colorPalette="info"
                  direction="row"
                  alignItems="center"
                  bg="colorPalette.3"
                  p="400"
                  gap="400"
                  mt="200"
                >
                  <Text color="colorPalette.11">
                    <Info size="2em" />
                  </Text>
                  <Text color="colorPalette.11">
                    The new document item will become a child of the current
                    document.
                  </Text>
                </Stack>
              </Stack>
            </Stack>
          ) : (
            <Text fontWeight="600" mt="500" mb="200">
              Saving in progress...
            </Text>
          )}
        </Dialog.Body>
        {!isLoading && (
          <Dialog.Footer>
            <Button variant="ghost" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="solid"
              colorPalette="primary"
              disabled={!isFormValid}
              onPress={handleSubmit}
            >
              Create
            </Button>
          </Dialog.Footer>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};
