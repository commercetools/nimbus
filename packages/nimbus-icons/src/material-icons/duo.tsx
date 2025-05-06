import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDuo = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M20 2h-8C6.38 2 2 6.66 2 12.28 2 17.5 6.49 22 11.72 22 17.39 22 22 17.62 22 12V4c0-1.1-.9-2-2-2m-3 13-3-2v2H7V9h7v2l3-2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgDuo);
export default ForwardRef;
