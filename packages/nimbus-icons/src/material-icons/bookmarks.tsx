import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgBookmarks = (
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
    <path d="M15 7v12.97l-4.21-1.81-.79-.34-.79.34L5 19.97V7zm4-6H8.99C7.89 1 7 1.9 7 3h10c1.1 0 2 .9 2 2v13l2 1V3c0-1.1-.9-2-2-2m-4 4H5c-1.1 0-2 .9-2 2v16l7-3 7 3V7c0-1.1-.9-2-2-2" />
  </svg>
);
const ForwardRef = forwardRef(SvgBookmarks);
export default ForwardRef;
