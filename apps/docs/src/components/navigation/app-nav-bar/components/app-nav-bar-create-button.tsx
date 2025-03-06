import { Info, Add } from "@bleh-ui/icons";
import {
  Button,
  DialogBackdrop,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Stack,
  Text,
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@bleh-ui/react";
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
    <DialogRoot open={isOpen} onEscapeKeyDown={() => setIsOpen(false)}>
      <DialogBackdrop />
      <DialogTrigger asChild>
        <Button
          colorPalette="primary"
          size="xs"
          variant="ghost"
          onPress={() => setIsOpen(true)}
        >
          <Add />
          New document
        </Button>
      </DialogTrigger>
      <DialogContent divideY="1px">
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new document.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          {!isLoading ? (
            <Stack gap="400" mt="400">
              <Stack>
                <Text asChild fontWeight="600">
                  <label htmlFor="title">Title</label>
                </Text>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Keep it short, you're busy."
                  autoComplete="off"
                  data-form-type="other"
                />
              </Stack>
              <Stack>
                <Text asChild fontWeight="600">
                  <label htmlFor="description">Description</label>
                </Text>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Just enough to make it intriguing"
                  autoComplete="off"
                />
              </Stack>
              <Stack>
                <Text asChild fontWeight="600">
                  <label htmlFor="menuLabel">Menu Label</label>
                </Text>
                <Input
                  id="menuLabel"
                  value={menuLabel}
                  onChange={(e) => setMenuLabel(e.target.value)}
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
        </DialogBody>
        {!isLoading && (
          <DialogFooter>
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
          </DialogFooter>
        )}
      </DialogContent>
    </DialogRoot>
  );
};
