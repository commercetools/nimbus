import { PlusIcon } from "@bleh-ui/icons";
import {
  Button,
  DialogBackdrop,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Box,
  Stack,
} from "@bleh-ui/react";
import { useAtomValue } from "jotai";
import { activeDocAtom } from "@/atoms/activeDoc";
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@bleh-ui/react";
import { useState } from "react";

export const AppNavBarCreateButton = () => {
  const activeDoc = useAtomValue(activeDocAtom);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [menuLabel, setMenuLabel] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const isFormValid = title && description && menuLabel;

  const onSubmitRequest = () => {
    if (isFormValid) {
      // Handle the form submission logic here
      console.log("Form submitted with:", { title, description, menuLabel });
      setIsOpen(false);
    }
  };

  if (!activeDoc) return null;

  return (
    <DialogRoot open={isOpen} onEscapeKeyDown={() => setIsOpen(false)}>
      <DialogBackdrop />
      <DialogTrigger asChild>
        <Button variant="ghost" onClick={() => setIsOpen(true)}>
          <PlusIcon />
          Create
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
          <Stack gap="4">
            <Box>
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Box>
            <Box>
              <label htmlFor="description">Description</label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Box>
            <Box>
              <label htmlFor="menuLabel">Menu Label</label>
              <Input
                id="menuLabel"
                value={menuLabel}
                onChange={(e) => setMenuLabel(e.target.value)}
              />
            </Box>
          </Stack>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="solid"
            colorPalette="primary"
            disabled={!isFormValid}
            onClick={onSubmitRequest}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
