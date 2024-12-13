import { documentAudienceDescriptions } from "@/schemas/mdx-document-audiences";
import { useMemo } from "react";
import { useDocumentMetaSettings } from "../use-document-meta-settings";
import { Box, Flex, Stack, Text } from "@bleh-ui/react";

export const DocumentAudienceSelector = () => {
  const { meta, noDoc, save } = useDocumentMetaSettings();
  const options = useMemo(() => {
    return Object.keys(documentAudienceDescriptions).map((key) => {
      const item = documentAudienceDescriptions[key];
      return {
        id: key,
        value: key,
        ...item,
      };
    });
  }, []);

  const onSaveRequest = (audiences) => {
    const payload = { ...meta, documentAudiences: audiences };
    save(payload);
  };

  const handleCheckboxChange = (id) => {
    let audiences = meta?.documentAudiences || [];
    if (audiences.includes(id)) {
      audiences = audiences.filter((audience) => audience !== id);
    } else {
      audiences = [...audiences, id];
    }
    onSaveRequest(audiences);
  };

  if (noDoc) return null;

  return (
    <Stack>
      <Text fontWeight="semibold">Document Audience</Text>
      <Stack border="1px solid" borderColor="neutral.6" p="4" rounded="sm">
        {options.map(({ id, label }) => (
          <Flex key={id}>
            <Box>
              <input
                id={"chkb" + id}
                type="checkbox"
                checked={meta?.documentAudiences?.includes(id) || false}
                onChange={() => handleCheckboxChange(id)}
              />
            </Box>
            <Box>
              <Text ml="2" fontWeight="medium" color="neutral.11" asChild>
                <label htmlFor={"chkb" + id}>{label}</label>
              </Text>
            </Box>
          </Flex>
        ))}
      </Stack>
    </Stack>
  );
};
