import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgWaterDamage = (
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
    <path d="M12 3 2 12h3v8h14v-8h3zM7 18v-7.81l5-4.5 5 4.5V18zm7-4c0 1.1-.9 2-2 2s-2-.9-2-2 2-4 2-4 2 2.9 2 4" />
  </svg>
);
const ForwardRef = forwardRef(SvgWaterDamage);
export default ForwardRef;
