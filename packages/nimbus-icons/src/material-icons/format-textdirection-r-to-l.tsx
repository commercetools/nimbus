import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgFormatTextdirectionRToL = (
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
    <path d="M10 4v4c-1.1 0-2-.9-2-2s.9-2 2-2m8-2h-8C7.79 2 6 3.79 6 6s1.79 4 4 4v5h2V4h2v11h2V4h2zM8 14l-4 4 4 4v-3h12v-2H8z" />
  </svg>
);
const ForwardRef = forwardRef(SvgFormatTextdirectionRToL);
export default ForwardRef;
