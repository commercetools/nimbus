import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgLegendToggle = (
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
    <path d="M20 15H4v-2h16zm0 2H4v2h16zm-5-6 5-3.55V5l-5 3.55L10 5 4 8.66V11l5.92-3.61z" />
  </svg>
);
const ForwardRef = forwardRef(SvgLegendToggle);
export default ForwardRef;
