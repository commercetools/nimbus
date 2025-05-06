import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgBookmarkAdd = (
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
    <path d="M17 11v6.97l-5-2.14-5 2.14V5h6V3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V11zm4-4h-2v2h-2V7h-2V5h2V3h2v2h2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgBookmarkAdd);
export default ForwardRef;
