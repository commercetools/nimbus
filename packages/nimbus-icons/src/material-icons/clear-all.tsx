import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgClearAll = (
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
    <path d="M5 13h14v-2H5zm-2 4h14v-2H3zM7 7v2h14V7z" />
  </svg>
);
const ForwardRef = forwardRef(SvgClearAll);
export default ForwardRef;
