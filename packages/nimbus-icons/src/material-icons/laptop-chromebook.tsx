import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgLaptopChromebook = (
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
    <path d="M22 18V3H2v15H0v2h24v-2zm-8 0h-4v-1h4zm6-3H4V5h16z" />
  </svg>
);
const ForwardRef = forwardRef(SvgLaptopChromebook);
export default ForwardRef;
