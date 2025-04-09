import { Button, Stack } from "@nimbus/react";
import { PropTable } from "./prop-table.tsx";
import { useEffect, useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import { typesAtom } from "../../../../atoms/types.ts";

type PropTableProps = {
  /** ids of the components (usually the exported name) */
  ids: string | string[];
  /** if compound component is documented, set the root e.g `Select` for all Select related subcomponents */
  root: string | undefined;
};

export const PropTables = ({ ids, root }: PropTableProps) => {
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
      <Stack direction="row">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            value={tab.id}
            onPress={() => setActiveComponentId(tab.id)}
            colorScheme="primary"
            size="xs"
            variant={activeComponentId === tab.id ? "subtle" : "ghost"}
          >
            {root ? tab.label.split(root).join(root + ".") : tab.label}
          </Button>
        ))}
      </Stack>
      {activeComponentId && <PropTable id={activeComponentId} />}
    </Stack>
  );
};
