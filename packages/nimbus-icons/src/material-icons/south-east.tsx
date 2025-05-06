import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSouthEast = (
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
    <path d="M19 9h-2v6.59L5.41 4 4 5.41 15.59 17H9v2h10z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSouthEast);
export default ForwardRef;
