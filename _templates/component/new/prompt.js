// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master?tab=readme-ov-file#-prompts

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
    message: "What's the name of the new component (use PascalCase)?",
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
  },
  {
    type: "input",
    name: "elementType",
    message: (answers) => {
      const elementType = mapping[answers.answers.element] || "UnknownElement";
      return (
        "What is the element type? Press Enter for default value: " +
        elementType +
        ""
      );
    },
    initial: (answers) => {
      const elementType = mapping[answers.enquirer.answers.element];
      return elementType || "UnknownElement";
    },
  },
];
