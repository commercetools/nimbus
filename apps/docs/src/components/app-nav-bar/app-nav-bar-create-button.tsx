import { InfoIcon, PlusIcon } from "@bleh-ui/icons";
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
import { activeDocAtom } from "@/atoms/active-doc.ts";
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
    if (!isFormValid) return;

    const fileNameSeed = [...activeDoc?.meta.menu, menuLabel].join("-");

    const fileName = sluggify(fileNameSeed) + ".mdx";
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
  };

  if (!activeDoc) return null;

  return (
    <DialogRoot open={isOpen} onEscapeKeyDown={() => setIsOpen(false)}>
      <DialogBackdrop />
      <DialogTrigger asChild>
        <Button
          colorPalette="primary"
          size="xs"
          variant="ghost"
          onClick={() => setIsOpen(true)}
        >
          <PlusIcon />
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
          {!isLoading && (
            <Stack gap="4" mt="4">
              <Stack>
                <Text asChild fontWeight="semibold">
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
                <Text asChild fontWeight="semibold">
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
                <Text asChild fontWeight="semibold">
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
                  p="4"
                  gap="4"
                  mt="2"
                >
                  <Text color="colorPalette.11">
                    <InfoIcon size="2em" />
                  </Text>
                  <Text color="colorPalette.11">
                    The new document item will become a child of the current
                    document.
                  </Text>
                </Stack>
              </Stack>
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
