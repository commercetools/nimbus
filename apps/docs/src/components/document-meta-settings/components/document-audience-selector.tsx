import {
  DocumentAudience,
  documentAudienceDescriptions,
} from "@/schemas/mdx-document-audiences";
import { useMemo } from "react";
import { Box, Flex, Stack, Text } from "@bleh-ui/react";
import { useUpdateDocument } from "@/hooks/useUpdateDocument";

// Define the type for the audience options
interface AudienceOption {
  id: DocumentAudience;
  value: string;
  label: string;
  description?: string;
}

/**
 * DocumentAudienceSelector component allows users to select document audiences.
 * @returns {JSX.Element | null} The rendered component or null if no document is available.
 */
export const DocumentAudienceSelector = (): JSX.Element | null => {
  const { meta, updateMeta } = useUpdateDocument();

  // Memoize the options to avoid recalculating on every render
  const options: AudienceOption[] = useMemo(() => {
    return Object.keys(documentAudienceDescriptions).map((key) => {
      const item = documentAudienceDescriptions[key as DocumentAudience];
      return {
        id: key as DocumentAudience,
        value: key,
        ...item,
      };
    });
  }, []);

  /**
   * Handles the save request for document audiences.
   * @param {DocumentAudience[]} audiences - The selected audiences.
   */
  const onSaveRequest = (audiences: DocumentAudience[]) => {
    if (!meta) return;
    const payload = { ...meta, documentAudiences: audiences };
    updateMeta(payload);
  };

  /**
   * Handles the change event for the checkboxes.
   * @param {string} id - The id of the audience.
   */
  const handleCheckboxChange = (id: DocumentAudience) => {
    let audiences: DocumentAudience[] = meta?.documentAudiences || [];
    if (audiences.includes(id)) {
      audiences = audiences.filter((audience) => audience !== id);
    } else {
      audiences = [...audiences, id];
    }
    onSaveRequest(audiences);
  };

  return (
    <Stack>
      <Text fontWeight="600">Document Audience</Text>
      <Stack border="solid-25" borderColor="neutral.6" p="400">
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
              <Text ml="200" fontWeight="500" color="neutral.11" asChild>
                <label htmlFor={"chkb" + id}>{label}</label>
              </Text>
            </Box>
          </Flex>
        ))}
      </Stack>
    </Stack>
  );
};
