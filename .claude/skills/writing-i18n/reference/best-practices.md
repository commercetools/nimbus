# Writing i18n Best Practices

## Best Practices

### ✅ DO

- Use i18n for ALL user-facing text
- Keep messages concise and clear
- Provide meaningful descriptions
- Use proper grammar and punctuation
- Test with different locales
- Use plural forms for counts
- Design layouts for text length variation

### ❌ DON'T

- Concatenate translated strings
- Use i18n for debug/internal messages
- Hardcode strings that should be translatable
- Omit descriptions
- Use technical jargon in default messages
- Assume text length stays constant

### Common Patterns

**Conditional messages:**

```typescript
const message = isVisible
  ? messages.hide
  : messages.show;

return <button aria-label={msg.format(message)} />;
```

**Pluralization:**

```typescript
defaultMessage: "{count, plural, one {# item} other {# items}}";
```

**With variables:**

```typescript
defaultMessage: "Page {current} of {total}";

// Usage
msg.format("pageInfo", { current: 1, total: 10 });
```
