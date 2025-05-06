import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgAreaChart = (
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
    <path d="m17 7-5-4-5 7-4-3v13h18V7zm2 9.95-7-5.45L8 17l-3-2.4V11l2.44 1.83 4.96-6.95L16.3 9H19z" />
  </svg>
);
const ForwardRef = forwardRef(SvgAreaChart);
export default ForwardRef;
