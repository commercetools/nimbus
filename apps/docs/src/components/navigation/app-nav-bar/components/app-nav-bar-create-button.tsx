import { Info, Add } from "@commercetools/nimbus-icons";
import {
  Button,
  LegacyDialog,
  TextInput,
  Stack,
  Text,
} from "@commercetools/nimbus";
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
    <LegacyDialog.Root open={isOpen} onEscapeKeyDown={() => setIsOpen(false)}>
      <LegacyDialog.Backdrop />
      <LegacyDialog.Trigger asChild>
        <Button
          colorPalette="primary"
          size="xs"
          variant="ghost"
          onPress={() => setIsOpen(true)}
        >
          <Add />
          New document
        </Button>
      </LegacyDialog.Trigger>
      <LegacyDialog.Content divideY="1px">
        <LegacyDialog.Header>
          <LegacyDialog.Title>Create New Document</LegacyDialog.Title>
          <LegacyDialog.Description>
            Fill in the details to create a new document.
          </LegacyDialog.Description>
        </LegacyDialog.Header>
        <LegacyDialog.Body>
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
        </LegacyDialog.Body>
        {!isLoading && (
          <LegacyDialog.Footer>
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
          </LegacyDialog.Footer>
        )}
      </LegacyDialog.Content>
    </LegacyDialog.Root>
  );
};
