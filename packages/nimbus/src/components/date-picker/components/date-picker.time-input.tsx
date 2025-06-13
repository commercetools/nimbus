import { TimeInput } from "@/components";
import { useContext } from "react";
import { useLocale } from "react-aria";
import { DatePickerStateContext } from "react-aria-components";

export const DatePickerTimeInput = () => {
  const { locale } = useLocale();
  const context = useContext(DatePickerStateContext);
  console.log("DatePickerStateContext", context);
  return (
    <TimeInput
      locale={locale}
      value={context?.timeValue}
      onChange={context?.setTimeValue}
    />
  );
};
