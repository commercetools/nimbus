import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgRMobiledata = (
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
    <path d="M7.8 7.2 9 10H7L5.87 7.33H4V10H2V2h5c1.13 0 2 .87 2 2v1.33c0 .8-.53 1.54-1.2 1.87M7 4H4v1.33h3z" />
  </svg>
);
const ForwardRef = forwardRef(SvgRMobiledata);
export default ForwardRef;
