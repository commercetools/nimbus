---
to: "<%= hasSlots === 'yes' ? `packages/bleh-ui/src/components/${h.changeCase.paramCase(name)}/${h.changeCase.paramCase(name)}.slots.tsx` : null %>"
---

import { Box } from '@chakra-ui/react';
import { type ReactNode } from 'react';

type T<%= h.changeCase.pascal(name) %>Slots = {
  firstSlot?: ReactNode;
  secondSlot?: ReactNode;
};

export const <%= h.changeCase.pascal(name) %>Slots: React.FC<T<%= h.changeCase.pascal(name) %>Slots> = ({ firstSlot, secondSlot }) => {
  return (
    <div>
      {/* First slot */}
      {firstSlot && <Box mb={4}>{firstSlot}</Box>}

      {/* Second slot */}
      {secondSlot && <Box>{secondSlot}</Box>}
    </div>
  );
};
