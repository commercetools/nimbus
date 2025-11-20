import React, { useState } from "react";
import { Checkbox, Stack } from "@/components";
import type { StoryObj } from "@storybook/react-vite";

import { columns, rows } from "../test-data";
import type { DataTableProps } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

export const AdjustableColumns: Story = {
  render: (args) => {
    const [isResizable, setIsResizable] = useState(false);
    return (
      <Stack gap="400" alignItems="flex-start">
        <Checkbox isSelected={isResizable} onChange={setIsResizable}>
          Resizable Column
        </Checkbox>
        <DataTableWithModals
          {...args}
          isResizable={isResizable}
          onRowClick={() => {}}
        />
      </Stack>
    );
  },
  args: {
    columns,
    rows,
  },
};
