// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//

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
    type: "select",
    name: "hasSlots",
    message: "Does this component need slots?",
    choices: ["yes", "no"],
    initial: "yes", // Default to 'yes'
  },
];
