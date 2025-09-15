# Nimbus Documentation

This directory contains comprehensive documentation for the Nimbus design system component development.

## 📚 Documentation Structure

### Component Development
- **[Component Guidelines](./component-guidelines.md)** - Main hub for component development guidelines
- **[File Type Guidelines](./file-type-guidelines/)** - Detailed guides for each file type in a component
- **[Component Templates](./component-templates/)** - Ready-to-use boilerplate code for new components

## 🚀 Quick Start

### Creating a New Component
1. Start with [Component Guidelines](./component-guidelines.md)
2. Use [Architecture Decisions](./file-type-guidelines/architecture-decisions.md) to determine component type
3. Copy templates from [Component Templates](./component-templates/)
4. Follow specific guidelines in [File Type Guidelines](./file-type-guidelines/)

### Updating Existing Components
1. Check specific file type guidelines for patterns
2. Use validation checklists to ensure compliance

## 📁 Directory Contents

```
docs/
├── readme.md                    # This file
├── component-guidelines.md      # Main navigation hub
├── file-type-guidelines/       # Detailed file-specific guides
│   ├── index.md
│   ├── architecture-decisions.md
│   ├── barrel-exports.md
│   ├── main-component.md
│   ├── types.md
│   ├── stories.md
│   ├── documentation.md
│   ├── recipes.md
│   ├── slots.md
│   ├── compound-components.md
│   ├── hooks.md
│   ├── utils-and-constants.md
│   └── context-files.md
└── component-templates/        # Boilerplate templates
    ├── index.md
    ├── single-component.md
    ├── single-component.types.md
    ├── single-component.recipe.md
    ├── single-component.slots.md
    ├── single-component.stories.md
    ├── compound-component.md
    ├── compound-component.root.md
    ├── compound-component.slots.md
    ├── compound-component.stories.md
    ├── compound-component.types.md
    └── compound-component.recipe.md
```

## 🔑 Key Principles

1. **Consistency** - Follow established patterns across all components
2. **Accessibility** - Use React Aria for WCAG compliance
3. **Type Safety** - Comprehensive TypeScript definitions
4. **Testing** - Interactive components must have play functions
5. **Documentation** - Every component needs complete MDX documentation

## 🛠 Development Workflow

1. **Plan** - Determine architecture and patterns needed
2. **Implement** - Follow file type guidelines
3. **Test** - Write comprehensive stories with play functions
4. **Document** - Create MDX documentation
5. **Validate** - Run linting, type checking, and build

## 📝 Contributing

When updating these docs:
1. Maintain consistent formatting and structure
2. Include real examples from the codebase
3. Keep navigation links updated
4. Add validation checklists
5. Document common mistakes and solutions

---

For questions or suggestions, please open an issue or pull request.