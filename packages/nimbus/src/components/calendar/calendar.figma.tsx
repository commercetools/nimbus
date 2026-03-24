import figma from "@figma/code-connect/react";
import { Calendar } from "./calendar";
import { DatePicker } from "../date-picker/date-picker";
import { DateRangePicker } from "../date-range-picker/date-range-picker";
import { RangeCalendar } from "../range-calendar/range-calendar";

figma.connect(
  Calendar,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=4292-16006",
  {
    example: () => <Calendar />,
  }
);

// --- Variant-specific: Date-time → DatePicker ---
figma.connect(
  DatePicker,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=4292-16006",
  {
    variant: { Variant: "Date-time" },
    example: () => <DatePicker granularity="minute" />,
  }
);

// --- Variant-specific: Date range → RangeCalendar ---
figma.connect(
  RangeCalendar,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=4292-16006",
  {
    variant: { Variant: "Date range" },
    example: () => <RangeCalendar />,
  }
);

// --- Variant-specific: Date-time range → DateRangePicker ---
figma.connect(
  DateRangePicker,
  "https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=4292-16006",
  {
    variant: { Variant: "Date-time range" },
    example: () => <DateRangePicker granularity="minute" />,
  }
);
