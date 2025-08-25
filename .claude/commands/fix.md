---
description: Fix bugs or issues in a component
argument-hint: component-name "issue description"
allowed-tools: Task, Read, Grep
---

Based on the request: $ARGUMENTS

Use the nimbus-component-orchestrator agent to fix the reported issue. The agent will:
1. Parse the component name and issue description from your request
2. Analyze the component to understand the issue
3. Plan the fix to resolve the specific problem
4. Update implementation, styling, or other files as needed
5. Add tests to prevent regression of the same issue

Focus on resolving the specific problem while maintaining component stability.