import { Box, Button, Stack } from "@bleh-ui/react";
import { PropTable } from "./prop-table.tsx";
import { useEffect, useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import { typesAtom } from "../../../../atoms/types.ts";

type PropTableProps = {
  ids: string | string[];
};

export const PropTables = ({ ids }: PropTableProps) => {
  const [activeComponentId, setActiveComponentId] = useState<string | null>(
    null
  );
  const typeArr = useAtomValue(typesAtom);

  const items = useMemo(() => {
    return typeof ids === "string" ? ids.split(",").map((v) => v.trim()) : ids;
  }, [ids]);

  const tabs = useMemo(() => {
    return items.map((id) => {
      const item = typeArr.find((v) => v.displayName === id);
      return {
        id,
        label: item?.displayName || id,
      };
    });
  }, [typeArr, items]);

  useEffect(() => {
    if (tabs && !activeComponentId) {
      setActiveComponentId(tabs[0].id);
    }
  }, [activeComponentId, tabs]);

  useEffect(() => {
    setActiveComponentId(tabs[0].id);
  }, [tabs]);

  return (
    <Stack gap="400">
      <Box>
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            value={tab.id}
            onClick={() => setActiveComponentId(tab.id)}
            colorScheme="primary"
            size="xs"
            variant={activeComponentId === tab.id ? "subtle" : "ghost"}
          >
            {tab.label}
          </Button>
        ))}
      </Box>
      {activeComponentId && <PropTable id={activeComponentId} />}
    </Stack>
  );
};
