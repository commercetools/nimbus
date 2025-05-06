import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCompareArrows = (
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
    <path d="M9.01 14H2v2h7.01v3L13 15l-3.99-4zm5.98-1v-3H22V8h-7.01V5L11 9z" />
  </svg>
);
const ForwardRef = forwardRef(SvgCompareArrows);
export default ForwardRef;
