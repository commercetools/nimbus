import { activeDocAtom } from "../../atoms/activeDoc";
import { useAtomValue } from "jotai";

import { useMemo } from "react";

import { MdxStringRenderer } from "../MdxStringRenderer";

import { Box, Stack } from "@bleh-ui/react";

import { components } from "./components";
import { BreadcrumbNav } from "../Breadcrumb";
export const DocumentRenderer = () => {
  const activeDoc = useAtomValue(activeDocAtom);
  const content = useMemo(() => {
    if (!activeDoc?.mdx) return "";
    return activeDoc.mdx;
  }, [activeDoc]);

  if (!content) return "Loading...";

  return (
    <Box width="100%" maxWidth="960px" mx="">
      <Stack gap="4">
        <Box>
          <BreadcrumbNav />
        </Box>
        <Box>
          <MdxStringRenderer content={content} components={components} />
        </Box>
      </Stack>
    </Box>
  );
};
