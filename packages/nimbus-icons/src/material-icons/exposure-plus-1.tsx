import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgExposurePlus1 = (
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
    <path d="M10 7H8v4H4v2h4v4h2v-4h4v-2h-4zm10 11h-2V7.38L15 8.4V6.7L19.7 5h.3z" />
  </svg>
);
const ForwardRef = forwardRef(SvgExposurePlus1);
export default ForwardRef;
