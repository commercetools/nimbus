import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgHouseSiding = (
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
    <path d="M19 12h3L12 3 2 12h3v8h2v-2h10v2h2zM7.21 10h9.58l.21.19V12H7v-1.81zm7.36-2H9.43L12 5.69zM7 16v-2h10v2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgHouseSiding);
export default ForwardRef;
