# MCP-UI Workflow Diagrams

This directory contains PlantUML diagram source files for the MCP-UI workflow documentation.

## Files

- `sequence-diagram.puml` - System architecture sequence diagram (59KB PNG)
- `gantt-chart.puml` - Implementation timeline Gantt chart (67KB PNG)
- `sequence-diagram.png` - Generated PNG for Google Docs
- `gantt-chart.png` - Generated PNG for Google Docs

## Generating Diagrams

### Prerequisites

Install PlantUML and Java (one-time setup):

```bash
brew install openjdk@17
brew install plantuml
```

### Regenerate PNG Files

To regenerate the PNG images from source files:

```bash
cd plans/full-mcp-ui-workflow/assets
plantuml sequence-diagram.puml
plantuml gantt-chart.puml
```

This will create/update the PNG files that can be inserted directly into Google Docs.

## Color Codes

The three implementation buckets use these colors:

| Bucket | Color Name | Hex Code | Emoji | Text Color |
|--------|-----------|----------|-------|------------|
| MCP-UI Server/Client | Blue | `#4A90E2` | 🔵 | `#2E5C8A` (dark blue) |
| Theming Support & Service | Green | `#7ED321` | 🟢 | `#2D5016` (dark green) |
| SSR & Component Rendering | Orange | `#F5A623` | 🟠 | `#7A4D0F` (dark brown) |

## PlantUML Customization

### Sequence Diagram

The sequence diagram uses custom skinparam settings to apply bucket colors to participants:

- **MCP-UI Server**: Blue background (`#4A90E2`)
- **Rendering Service**: Orange background (`#F5A623`)
- **Theme Service**: Green background (`#7ED321`)
- **User/LLM**: Neutral gray backgrounds

### Gantt Chart

The Gantt chart uses PlantUML's advanced coloring syntax:

- Tasks can have individual background/text colors: `[Task] is colored in #BACKGROUND/#TEXTCOLOR`
- Section separators use transparent lines for clean visual separation
- Timeline grid lines are hidden for better readability
- Tasks have vertical padding (Padding 8, Margin 4) for improved appearance

## Key Milestones

The four key integration milestones documented in the timeline:

- **Phase 1:** MCP-UI functional for internal applications with core components (Weeks 1-4) - Remote DOM Foundation
- **Phase 2:** Themed Rendering (Weeks 5-7) - After Theme Validation & Testing
- **Phase 3:** External Use Cases (Weeks 8-11) - After Hosted Widget Use Case
- **Phase 4:** Production Hardening (Weeks 12-14) - Production deployment and monitoring

**Note:** Component Coverage Expansion runs as ongoing maintenance in parallel and does not gate phase progression.

## Why PlantUML?

PlantUML was chosen over Mermaid for these diagrams because:

- ✅ **Full color control** - Can apply distinct colors to all three buckets in Gantt chart (Mermaid only supports 2 alternating colors)
- ✅ **Text positioning** - Better control over text placement within colored bars
- ✅ **Contrast control** - Can specify background/text color pairs for readability
- ✅ **Layout customization** - More control over spacing, padding, and visual appearance
- ✅ **Production quality** - Generates high-quality PNG files ready for Google Docs

## Troubleshooting

### "Unable to locate a Java Runtime" Error

PlantUML requires Java to run. Install OpenJDK:

```bash
brew install openjdk@17
```

### Syntax Errors

- Use `@startgantt` (not `@startuml gantt`) for Gantt charts
- Use `@startuml` for sequence diagrams
- Check PlantUML documentation for specific syntax requirements

### PNG Not Generated

Ensure you're in the correct directory when running plantuml:

```bash
cd plans/full-mcp-ui-workflow/assets
plantuml *.puml
```

This will regenerate all PNG files from source.
