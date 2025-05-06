import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgArrowBackIosNew = (
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
    <path d="M17.77 3.77 16 2 6 12l10 10 1.77-1.77L9.54 12z" />
  </svg>
);
const ForwardRef = forwardRef(SvgArrowBackIosNew);
export default ForwardRef;
