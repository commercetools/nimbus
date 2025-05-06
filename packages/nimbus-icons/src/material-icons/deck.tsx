import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDeck = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M22 9 12 2 2 9h9v13h2V9zM12 4.44 15.66 7H8.34z" />
    <path d="m4.14 12-1.96.37.82 4.37V22h2l.02-4H7v4h2v-6H4.9zm14.96 4H15v6h2v-4h1.98l.02 4h2v-5.26l.82-4.37-1.96-.37z" />
  </svg>
);
const ForwardRef = forwardRef(SvgDeck);
export default ForwardRef;
