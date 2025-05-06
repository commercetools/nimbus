import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgAlignHorizontalCenter = (
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
    <path d="M11 2h2v5h8v3h-8v4h5v3h-5v5h-2v-5H6v-3h5v-4H3V7h8z" />
  </svg>
);
const ForwardRef = forwardRef(SvgAlignHorizontalCenter);
export default ForwardRef;
