import {
  Flex,
  Text,
  TextInput,
  Stack,
  SimpleGrid,
  useCopyToClipboard,
  Tooltip,
  MakeElementFocusable,
} from "@commercetools/nimbus";
import { useEffect, useState } from "react";
import take from "lodash/take";

import * as icons from "@commercetools/nimbus-icons";

/**
 * IconSearch component allows users to search and copy icon import statements.
 */
export const IconSearch = () => {
  const [, copyToClipboard] = useCopyToClipboard();
  const [q, setQ] = useState<string>("");

  // State to hold filtered icons
  const [filteredIcons, setFilteredIcons] = useState<string[] | null>(null);

  useEffect(() => {
    // Initial effect, can be used for setup if needed
  }, []);

  useEffect(() => {
    if (!icons) return;

    // Filter icons based on the search query
    const filtered = Object.keys(icons).filter((v) => {
      return v.toLowerCase().includes(q.toLowerCase());
    });

    setFilteredIcons(filtered);
  }, [q]);

  /**
   * Handles the copy request for an icon import statement.
   * @param {string} iconId - The ID of the icon to copy.
   */
  const onCopyRequest = (iconId: string) => {
    copyToClipboard(`import { ${iconId} } from '@commercetools/nimbus-icons';`);

    alert("Copied the import statement to the clipboard");
  };

  return (
    <Stack mt="800" mb="1600" gap="800">
      <TextInput
        placeholder={`Search through ${Object.keys(icons).length} icons ...`}
        value={q}
        onChange={(value) => setQ(value)}
      />
      <SimpleGrid columns={[5, 6, 6, 6, 10]}>
        {take(filteredIcons ?? [], q.length ? 128 : 256).map((iconId) => {
          const Component = icons[iconId as keyof typeof icons];
          return (
            <Tooltip.Root>
              <MakeElementFocusable>
                <Flex
                  p="400"
                  border="solid-25"
                  borderColor="neutral.5"
                  ml="-1px"
                  mb="-1px"
                  aspectRatio={1}
                  cursor={"pointer"}
                  _hover={{ bg: "neutral.2" }}
                  onClick={() => onCopyRequest(iconId)}
                  key={iconId}
                >
                  <Text m="auto" textStyle="3xl" color="neutral.12">
                    <Component />
                  </Text>
                </Flex>
              </MakeElementFocusable>
              <Tooltip.Content>{iconId}</Tooltip.Content>
            </Tooltip.Root>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
};
