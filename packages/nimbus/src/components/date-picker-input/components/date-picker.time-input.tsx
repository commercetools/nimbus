import { TimeInput } from "@/components";
import { useLocale } from "react-aria";
import { DatePickerContext, useSlottedContext } from "react-aria-components";

export const DatePickerTimeInput = () => {
  const { locale } = useLocale();
  const context = useSlottedContext(DatePickerContext);
  console.log("DatePickerContext", context);
  return <TimeInput locale={locale} />;
};
