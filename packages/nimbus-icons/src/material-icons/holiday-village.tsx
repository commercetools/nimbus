import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgHolidayVillage = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    aria-hidden="true"
    fill="currentColor"
    viewBox="0 0 24 24"
    ref={ref}
    {...props}
  >
    <path d="m8 4-6 6v10h12V10zm4 14H9v-3H7v3H4v-7.17l4-4 4 4zm-3-5H7v-2h2zm9 7V8.35L13.65 4h-2.83L16 9.18V20zm4 0V6.69L19.31 4h-2.83L20 7.52V20z" />
  </svg>
);
const ForwardRef = forwardRef(SvgHolidayVillage);
export default ForwardRef;
