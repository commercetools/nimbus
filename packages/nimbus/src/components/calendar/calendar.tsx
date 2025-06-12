import type { CalendarProps } from "./calendar.types";
import type { DateValue } from "react-aria";

import { Calendar as RaCalendar } from "react-aria-components";

import { CalendarRootSlot } from "./calendar.slots";
import { CalendarGrids } from "./components/calendar.grids";
import { CalendarHeader } from "./components/calendar.header";

export const Calendar = (props: CalendarProps<DateValue>) => {
  return (
    <CalendarRootSlot asChild>
      <RaCalendar {...props}>
        <CalendarHeader />
        <CalendarGrids />
      </RaCalendar>
    </CalendarRootSlot>
  );
};
