import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgTrendingFlat = (
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
    <path d="m22 12-4-4v3H3v2h15v3z" />
  </svg>
);
const ForwardRef = forwardRef(SvgTrendingFlat);
export default ForwardRef;
