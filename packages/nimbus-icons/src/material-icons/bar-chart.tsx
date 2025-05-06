import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgBarChart = (
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
    <path d="M4 9h4v11H4zm12 4h4v7h-4zm-6-9h4v16h-4z" />
  </svg>
);
const ForwardRef = forwardRef(SvgBarChart);
export default ForwardRef;
