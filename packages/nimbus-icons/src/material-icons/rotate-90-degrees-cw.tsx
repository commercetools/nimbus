import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgRotate90DegreesCw = (
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
    <path d="M2 13a9 9 0 0 0 13.79 7.62l-1.46-1.46c-.99.53-2.13.84-3.33.84-3.86 0-7-3.14-7-7s3.14-7 7-7h.17L9.59 7.59 11 9l4-4-4-4-1.42 1.41L11.17 4H11a9 9 0 0 0-9 9m9 0 6 6 6-6-6-6zm6 3.17L13.83 13 17 9.83 20.17 13z" />
  </svg>
);
const ForwardRef = forwardRef(SvgRotate90DegreesCw);
export default ForwardRef;
