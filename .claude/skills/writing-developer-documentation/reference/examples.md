# Developer Documentation: Reference Examples

## Reference Examples by Component Type

When generating documentation, reference these patterns based on component type:

### Simple Components (Button, Badge, TextInput)

**Best Reference**:
`packages/nimbus/src/components/text-input/text-input.dev.mdx`

- Minimal library dependencies
- Standard usage examples
- Clear accessibility guidance
- Focus: Visual variants, states (if applicable), controlled/uncontrolled modes

### Compound Components (Select, Menu)

**Best Reference**: `packages/nimbus/src/components/select/select.dev.mdx`

- Multiple sub-components
- Option groups and dynamic rendering
- Portal content testing
- Focus: Compound structure, composition patterns, keyboard navigation

### Components with External Libraries (DatePicker, DateRangePicker)

**Best Reference**:
`packages/nimbus/src/components/date-range-picker/date-range-picker.dev.mdx`

- "Working with [library]" section
- Library-specific types and conversions
- External library documentation links
- Focus: Library integration, type conversions, special value handling

### Field Patterns (TextInputField, DateRangePickerField)

**Best Reference**:
`packages/nimbus/src/patterns/fields/date-range-picker-field/date-range-picker-field.dev.mdx`
or
`packages/nimbus/src/patterns/fields/text-input-field/text-input-field.dev.mdx`

- Comparison section (field vs manual composition)
- Error handling with FieldErrors
- Form integration with Formik
- Links to base component and FormField
- Focus: Form patterns, error handling, validation

**IMPORTANT**: These are references for structure and patterns, NOT content.
Always generate examples based on the specific component's actual features and
props.
