import { CalendarRoot } from "./components/calendar.root";
import { CalendarHeader } from "./components/calendar.header";
import { CalendarGrid } from "./components/calendar.grid";

export const Calendar = () => {
  return (
    <CalendarRoot>
      <CalendarHeader />
      <CalendarGrid />
    </CalendarRoot>
  );
};
