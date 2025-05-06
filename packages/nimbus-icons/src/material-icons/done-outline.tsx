import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDoneOutline = (
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
    <path d="m19.77 4.93 1.4 1.4L8.43 19.07l-5.6-5.6 1.4-1.4 4.2 4.2zm0-2.83L8.43 13.44l-4.2-4.2L0 13.47l8.43 8.43L24 6.33z" />
  </svg>
);
const ForwardRef = forwardRef(SvgDoneOutline);
export default ForwardRef;
