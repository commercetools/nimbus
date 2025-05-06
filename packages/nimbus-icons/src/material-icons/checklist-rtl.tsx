import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgChecklistRtl = (
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
    <path d="M11 7H2v2h9zm0 8H2v2h9zm5.34-4L12.8 7.46l1.41-1.41 2.12 2.12 4.24-4.24L22 5.34zm0 8-3.54-3.54 1.41-1.41 2.12 2.12 4.24-4.24L22 13.34z" />
  </svg>
);
const ForwardRef = forwardRef(SvgChecklistRtl);
export default ForwardRef;
