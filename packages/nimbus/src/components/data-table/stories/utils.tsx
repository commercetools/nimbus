import React, {
  useState,
  isValidElement,
  type ReactNode,
  useEffect,
} from "react";
import {
  Box,
  Button,
  Dialog,
  Flex,
  Stack,
  Text,
  TextInput,
  DataTable,
} from "@/components";

import type { DataTableRowItem, DataTableProps } from "../data-table.types";

type ModalState = {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
};

export const InfoModal = ({ isOpen, onClose, title, children }: ModalState) => (
  <Dialog.Root
    isOpen={isOpen}
    onOpenChange={(open) => !open && onClose && onClose()}
  >
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>{children}</Dialog.Body>
      <Dialog.Footer>
        <Button onPress={onClose}>Close</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
);

type DetailsModalItemProps = {
  label: string;
  value: ReactNode;
};

export const DetailsModalItem = ({ label, value }: DetailsModalItemProps) =>
  label !== "children" &&
  !isValidElement(value) && (
    <Flex gap="200" as="li">
      <Text color="neutral.11" as="label" id={`${label}-${value}`}>
        {label}:
      </Text>
      <Text
        fontFamily={label === "ID" ? "mono" : undefined}
        aria-labelledby={`${label}-${value}`}
      >
        {value as string}
      </Text>
    </Flex>
  );

type ProductDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  row?: DataTableRowItem;
  onSave?: (updatedRow: DataTableRowItem) => void;
};

export const ProductDetailsModal = ({
  isOpen,
  onClose,
  row,
  onSave,
}: ProductDetailsModalProps) => {
  const [formData, setFormData] = useState<DataTableRowItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (row) {
      setFormData({ ...row });
    }
  }, [row]);

  if (!row || !formData) return null;

  const handleInputChange = (
    field: string,
    value: string | string[] | boolean
  ) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = async () => {
    if (formData && onSave) {
      setIsSaving(true);
      onSave(formData);
      // Brief delay to show saving state
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsSaving(false);
      // Don't call onClose here - let the parent handle it
    }
  };

  return (
    <Dialog.Root isOpen={isOpen}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{formData.name as string}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Stack gap="400">
            {/* Product Information */}
            <Box>
              <Text as="h2" fontWeight="500" mb="200">
                Product Information
              </Text>
              <Stack gap="300">
                <Box>
                  <Text as="label" fontSize="sm" fontWeight="500" mb="100">
                    Product name
                  </Text>
                  <TextInput
                    value={formData.name as string}
                    onChange={(value) => handleInputChange("name", value)}
                    width="100%"
                  />
                </Box>

                <Box>
                  <Text as="label" fontSize="sm" fontWeight="500" mb="100">
                    Category
                  </Text>
                  <TextInput
                    value={formData.category as string}
                    onChange={(value) => handleInputChange("category", value)}
                    width="100%"
                  />
                </Box>

                <Box>
                  <Text as="label" fontSize="sm" fontWeight="500" mb="100">
                    Status
                  </Text>
                  <select
                    value={
                      formData.published && formData.hasStagedChanges
                        ? "Modified"
                        : formData.published
                          ? "Published"
                          : "Unpublished"
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "Published") {
                        handleInputChange("published", true);
                        handleInputChange("hasStagedChanges", false);
                      } else if (value === "Modified") {
                        handleInputChange("published", true);
                        handleInputChange("hasStagedChanges", true);
                      } else if (value === "Unpublished") {
                        handleInputChange("published", false);
                        handleInputChange("hasStagedChanges", false);
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="Published">Published</option>
                    <option value="Modified">Modified</option>
                    <option value="Unpublished">Unpublished</option>
                  </select>
                </Box>

                <Box>
                  <Text as="label" fontSize="sm" fontWeight="500" mb="100">
                    Stores
                  </Text>
                  <TextInput
                    value={(formData.stores as string[]).toString() || ""}
                    onChange={(value) => {
                      handleInputChange("stores", value.split(","));
                    }}
                    width="100%"
                    placeholder="Enter stores separated by commas"
                    aria-label="stores"
                  />
                </Box>
              </Stack>
            </Box>

            <Box>
              <Text as="h2" fontWeight="500" mb="200">
                Technical Details
              </Text>
              <Stack gap="300">
                <Box>
                  <Text as="label" fontSize="sm" fontWeight="500" mb="100">
                    Product ID
                  </Text>
                  <TextInput
                    value={formData.key as string}
                    isReadOnly
                    width="100%"
                    backgroundColor="neutral.2"
                    isDisabled
                  />
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Dialog.Body>
        <Dialog.Footer>
          <Button
            onPress={() => {
              console.log("Cancel button clicked");
              onClose();
            }}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onPress={handleSave}
            colorPalette="primary"
            isDisabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

// Wrapper component that automatically handles modals for onRowClick
export const DataTableWithModals = ({
  onRowClick,
  isProductDetailsTable,
  ...props
}: DataTableProps & {
  onRowClick?: (row: DataTableRowItem) => void;
  isProductDetailsTable?: boolean;
}) => {
  const [rowClickModalState, setRowClickModalState] = useState<{
    isOpen: boolean;
    row?: DataTableRowItem;
  }>({
    isOpen: false,
  });

  const [tableData, setTableData] = useState<DataTableRowItem[]>(
    props.rows || []
  );
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    if (props.rows) {
      setTableData(props.rows);
      setDataVersion(0);
    }
  }, [props.rows]);

  const handleRowClick = onRowClick
    ? (row: DataTableRowItem) => {
        setRowClickModalState({ isOpen: true, row });
        onRowClick?.(row);
      }
    : undefined;

  const handleSave = (updatedRow: DataTableRowItem) => {
    setTableData((prev) => {
      const newData = [
        ...prev.map((row) =>
          row.id === updatedRow.id ? { ...updatedRow } : { ...row }
        ),
      ];
      return newData;
    });

    setDataVersion((prev) => prev + 1);
    setRowClickModalState({ isOpen: false, row: undefined });
  };

  return (
    <>
      <DataTable
        {...props}
        rows={tableData}
        onRowClick={handleRowClick}
        key={`table-v${dataVersion}`} // Force re-render when data changes
      />

      {/* Details Modal */}
      {onRowClick &&
        (isProductDetailsTable ? (
          <ProductDetailsModal
            isOpen={rowClickModalState.isOpen}
            onClose={() =>
              setRowClickModalState({ isOpen: false, row: undefined })
            }
            row={rowClickModalState?.row}
            onSave={handleSave}
          />
        ) : (
          <InfoModal
            isOpen={rowClickModalState.isOpen}
            onClose={() =>
              setRowClickModalState({ isOpen: false, row: undefined })
            }
            title={
              rowClickModalState.row?.name
                ? `${rowClickModalState?.row?.name}'s Details`
                : `Details for row ${rowClickModalState?.row?.id}`
            }
          >
            {rowClickModalState?.row && (
              <Stack as="ul" listStyle="none" gap="200">
                {Object.entries(rowClickModalState.row!)
                  .filter(([k]) => !["id", "children"].includes(k))
                  .map(([k, v]) => (
                    <DetailsModalItem
                      key={k}
                      label={k}
                      value={v as ReactNode}
                    />
                  ))}
              </Stack>
            )}
          </InfoModal>
        ))}
    </>
  );
};
