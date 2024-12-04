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
  Text,
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
import { sluggify } from "@/utils/sluggify";
import axios from "axios";

export const AppNavBarCreateButton = () => {
  const activeDoc = useAtomValue(activeDocAtom);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [menuLabel, setMenuLabel] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = title && description && menuLabel;

  const onSubmitRequest = async () => {
    if (!activeDoc) return;
    if (isFormValid) {
      const fileName = sluggify(title) + ".mdx";
      const filePath = [
        activeDoc.meta.filePath.replace(/\/[^\/]+$/, ""),
        fileName,
      ].join("/");

      const content = `---
id: ${activeDoc?.meta.title}-${title}
title: ${title}
description: ${description}
menu: ${JSON.stringify([...activeDoc?.meta.menu, menuLabel])}
order: 999
tags:
  - document
---

# ${title}

${description}
`;

      try {
        setIsLoading(true);
        await axios.post("/api/fs", { filePath, content });
        setTimeout(() => {
          setIsLoading(false);
          setIsOpen(false);
          setTitle("");
          setDescription("");
          setMenuLabel("");
        }, 2000);
      } catch (error) {
        console.error("Error creating file:", error);
        setIsLoading(false);
      }
    }
  };

  if (!activeDoc) return null;

  return (
    <DialogRoot open={isOpen} onEscapeKeyDown={() => setIsOpen(false)}>
      <DialogBackdrop />
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" onClick={() => setIsOpen(true)}>
          <PlusIcon size="1em" />
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
          {!isLoading && (
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
          )}
          {isLoading && (
            <Text fontWeight="semibold" mt="5" mb="2">
              Saving in progress...
            </Text>
          )}
        </DialogBody>
        {!isLoading && (
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
        )}
      </DialogContent>
    </DialogRoot>
  );
};
