import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgAnnouncement = (
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
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 14H5.17L4 17.17V4h16zM11 5h2v6h-2zm0 8h2v2h-2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgAnnouncement);
export default ForwardRef;
