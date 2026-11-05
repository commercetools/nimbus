# Developer Documentation Validation Report Format

### Validation Report Format

```markdown
## Developer Documentation Validation: {ComponentName}

### Status: [✅ PASS | ❌ FAIL | ⚠️ WARNING]

### Files Reviewed

- Documentation file: `{component}.dev.mdx`
- Test file: `{component}.docs.spec.tsx`
- Types file: `{component}.types.ts`
- Guidelines: `docs/file-type-guidelines/documentation.md`

### ✅ Compliant

[List passing checks]

### ❌ Violations (MUST FIX)

- [Violation with guideline reference and line number]

### ⚠️ Warnings (SHOULD FIX)

- [Non-critical improvements]

### Test File Status

- Test file exists: [Yes/No]
- Test sections present: [List @docs-section IDs]
- Tests are functional: [Pass/Fail]
- JSDoc tags complete: [Yes/No/Partial]

### Technical Quality Assessment

- Code examples: [Functional | Needs fixes | Non-functional]
- API documentation: [Complete | Partial | Missing]
- Implementation patterns: [Comprehensive | Adequate | Insufficient]
- Accessibility guidance: [Detailed | Basic | Missing]
- Test coverage: [Complete | Partial | Missing]

### Recommendations

- [Specific improvements needed]
```
