import { Box, Code, DataTable, Text } from "@commercetools/nimbus";
import { MdxStringRenderer } from "../../../mdx-string-renderer.tsx";
import { DefaultValue } from "./default-value.tsx";
import { formatJSDocDescription } from "../utils";
import type { PropItem } from "../types";

interface PropsCategoryTableProps {
  props: PropItem[];
  componentId: string;
  categoryTitle: string;
}

/**
 * Renders a single props table for a specific category
 */
export const PropsCategoryTable = ({
  props,
  componentId,
}: PropsCategoryTableProps) => {
  if (props.length === 0) {
    return null;
  }

  const propsWithIds = props.map((item) => ({
    ...item,
    id: [componentId, item.name].join("-"),
  }));

  const columns = [
    {
      id: "name",
      header: "name",
      accessor: (row: PropItem) => row.name,
      width: 200,
      render: ({ row }: { row: PropItem; value: string }) => (
        <Box display="flex" justifyContent="flex-start">
          <Box minW="16ch">
            <Text lang="en" fontFamily="mono" fontWeight="600" hyphens="auto">
              {row.name}
              {row.required && (
                <Box
                  as="sup"
                  title="required"
                  display="inline-block"
                  color="critical.10"
                  cursor="help"
                >
                  *
                </Box>
              )}
            </Text>
          </Box>
        </Box>
      ),
    },
    {
      id: "type",
      header: "type / description",
      accessor: (row: PropItem) => row.type?.name || "unknown",
      render: ({ row }: { row: PropItem; value: string }) => (
        <Box maxW="40ch">
          <Code mb="200">{row.type?.name || "unknown"}</Code>
          <MdxStringRenderer
            content={formatJSDocDescription(row.description)}
          />
        </Box>
      ),
    },
    {
      id: "default",
      header: "default",
      accessor: (row: PropItem) =>
        row.defaultValue?.value || row.defaultValue || "",
      width: 200,
      render: ({ row }: { row: PropItem; value: string }) => (
        <Box display="flex" justifyContent="flex-start">
          <DefaultValue value={row.defaultValue} />
        </Box>
      ),
    },
  ];

  return (
    <Box mb="600">
      <DataTable columns={columns} rows={propsWithIds} variant="outline" />
    </Box>
  );
};
