import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCurrencyFranc = (
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
    <path d="M18 5V3H7v13H5v2h2v3h2v-3h4v-2H9v-3h8v-2H9V5z" />
  </svg>
);
const ForwardRef = forwardRef(SvgCurrencyFranc);
export default ForwardRef;
