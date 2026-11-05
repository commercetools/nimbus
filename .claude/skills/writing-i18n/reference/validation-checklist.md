# Writing i18n Validation Checklist

### Validation Checklist

You MUST validate against these requirements:

#### File Structure

- [ ] i18n file exists with `.ts` extension
- [ ] Named export: `export const messages = {...})`
- [ ] Correct location: `{component}/{component}.i18n.ts`

#### Message IDs

- [ ] All IDs follow pattern: `Nimbus.{Component}.{key}`
- [ ] ComponentName is PascalCase
- [ ] messageKey is camelCase
- [ ] IDs are unique within file
- [ ] IDs match component name exactly

#### Message Properties

- [ ] All messages have `id`, `description`, `defaultMessage`
- [ ] Descriptions explain context for translators
- [ ] Default messages use proper grammar
- [ ] Default messages are user-friendly
- [ ] No technical jargon in default messages

#### Component Assessment

- [ ] Component assessed for i18n need
- [ ] Has default labels/aria-labels (if yes, needs i18n)
- [ ] Component imports messages correctly
- [ ] All user-facing text is internationalized
- [ ] No hardcoded strings in component

#### Integration

- [ ] Component imports `useLocalizedStringFormatter` from "@/hooks"
- [ ] Component imports compiled message strings from `*.messages.ts`
- [ ] Messages used with `msg.format(key)` or `msg.format(key, variables)`
- [ ] Dynamic values passed correctly as second parameter
