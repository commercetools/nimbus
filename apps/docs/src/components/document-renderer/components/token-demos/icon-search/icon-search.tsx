import {
  Box,
  Flex,
  Text,
  Input,
  Stack,
  SimpleGrid,
  Tooltip,
  useCopyToClipboard,
  toaster,
} from "@bleh-ui/react";
import { useEffect, useState } from "react";
import take from "lodash/take";

export const IconSearch = () => {
  const [state, copyToClipboard] = useCopyToClipboard();
  const [q, setQ] = useState("");
  const [icons, setIcons] = useState(null);
  const [filteredIcons, setFilteredIcons] = useState(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    const fetchIcons = async () => {
      const data = await import("@bleh-ui/icons");
      setIcons(data.icons);
      setFilteredIcons(Object.keys(data.icons));
      setBusy(false);
    };

    fetchIcons();
  }, []);

  useEffect(() => {
    if (!icons) return;

    const filtered = Object.keys(icons).filter((v) => {
      return v.toLowerCase().includes(q.toLowerCase());
    });

    setFilteredIcons(filtered);
  }, [q, icons]);

  const onCopyRequest = (iconId: string) => {
    copyToClipboard(`import { ${iconId} } from '@bleh-ui/icons';`);
    toaster.create({
      title: "Copied import statement",
      type: "success",
      description: `The import statement for the ${iconId} icon has been copied to your clipboard.`,
      duration: 4000,
    });
  };

  if (busy) {
    return <Text>Loading</Text>;
  }

  return (
    <Stack mt="8" mb="16" gap="8">
      <Input
        placeholder={`Search through ${Object.keys(icons).length} icons ...`}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <SimpleGrid columns={[5, 6, 6, 6, 10]}>
        {take(filteredIcons, q.length ? 128 : 256).map((iconId) => {
          const Component = icons[iconId];
          return (
            <Flex
              p="4"
              border="1px solid"
              borderColor="neutral.5"
              ml="-1px"
              mb="-1px"
              aspectRatio={1}
              cursor={"pointer"}
              _hover={{ bg: "neutral.2" }}
              onClick={() => onCopyRequest(iconId)}
              key={iconId}
            >
              <Tooltip
                content={iconId as string}
                openDelay={0}
                closeDelay={250}
              >
                <Text m="auto" textStyle="3xl" color="neutral.12">
                  <Component size="1em" />
                </Text>
              </Tooltip>
            </Flex>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
};
