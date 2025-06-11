import {
  Button as RaButton,
  Heading as RaHeading,
} from "react-aria-components";
import { chakra } from "@chakra-ui/react";
import { CalendarHeaderSlot } from "../calendar.slots";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@commercetools/nimbus-icons";

export const CalendarHeader = () => (
  <CalendarHeaderSlot>
    <RaHeading />
    <chakra.div>
      <RaButton slot="previous">
        <ChevronLeftIcon />
      </RaButton>
      <RaButton slot="next">
        <ChevronRightIcon />
      </RaButton>
    </chakra.div>
  </CalendarHeaderSlot>
);
