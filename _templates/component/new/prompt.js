const mapping = {
  div: "HTMLDivElement",
  a: "HTMLAnchorElement",
  p: "HTMLParagraphElement",
  pre: "HTMLPreElement",
  span: "HTMLSpanElement",
  button: "HTMLButtonElement",
  input: "HTMLInputElement",
  textarea: "HTMLTextAreaElement",
  select: "HTMLSelectElement",
  option: "HTMLOptionElement",
  form: "HTMLFormElement",
  label: "HTMLLabelElement",
  ul: "HTMLUListElement",
  ol: "HTMLOListElement",
  li: "HTMLLIElement",
  section: "HTMLElement",
  header: "HTMLElement",
  footer: "HTMLElement",
  main: "HTMLElement",
  aside: "HTMLElement",
  nav: "HTMLElement",
  svg: "SVGSVGElement",
};

module.exports = [
  {
    type: "input",
    name: "name",
    message: "What's the name of the new component?",
  },
  {
    type: "input",
    name: "purpose",
    message: "What's the purpose of this component?",
  },
  {
    type: "input",
    name: "element",
    message:
      "What is the DOM element for the component (e.g., 'button', 'div')?",
    validate(value) {
      if (!mapping[value]) {
        return `Invalid element. Allowed values are: ${Object.keys(mapping).join(", ")}`;
      }
      return true;
    },
  },
  {
    type: "input",
    name: "elementType",
    initial: async (answers) => {
      return mapping[answers.element];
    },
    skip: true, // Don't prompt the user; calculate automatically
  },
];
