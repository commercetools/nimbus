import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCalendarViewDay = (
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
    <path d="M3 17h18v2H3zm16-5v1H5v-1zm2-2H3v5h18zM3 6h18v2H3z" />
  </svg>
);
const ForwardRef = forwardRef(SvgCalendarViewDay);
export default ForwardRef;
