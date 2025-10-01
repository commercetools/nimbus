import { defineMessages } from "react-intl";

const messages = defineMessages({
  selectLabel: {
    id: "Nimbus.SelectableSearchInput.selectLabel",
    description: "Default aria-label for select dropdown",
    defaultMessage: "Filter by",
  },
  searchLabel: {
    id: "Nimbus.SelectableSearchInput.searchLabel",
    description: "Default aria-label for search input",
    defaultMessage: "Search",
  },
  submitButton: {
    id: "Nimbus.SelectableSearchInput.submitButton",
    description: "aria-label for submit button",
    defaultMessage: "Submit search",
  },
  clearButton: {
    id: "Nimbus.SelectableSearchInput.clearButton",
    description: "aria-label for clear button",
    defaultMessage: "Clear search",
  },
});

export default messages;
