import React from "react";
import { Box, Flex, Heading } from "@commercetools/nimbus";
import { ComponentStatus } from "@/src/components/status/component-status";
import { useAtomValue } from "jotai";
import { activeDocAtom } from "@/src/atoms/active-doc";

interface DocumentTitleProps {
  title: string;
}

/**
 * DocumentTitle component renders the main document title with a component status badge
 * when the document has a componentStatus metadata field.
 */
export const DocumentTitle: React.FC<DocumentTitleProps> = ({ title }) => {
  const activeDoc = useAtomValue(activeDocAtom);
  const componentStatus = activeDoc?.meta?.componentStatus || null;

  return (
    <Box mb="600">
      <Flex
        alignItems="center"
        gap="300"
        pb="300"
        borderBottom="1px solid"
        borderColor="neutral.6"
      >
        <Heading size="3xl">{title}</Heading>
        {componentStatus && (
          <ComponentStatus status={componentStatus} showLabel={true} />
        )}
      </Flex>
    </Box>
  );
};
