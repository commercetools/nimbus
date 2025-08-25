---
description: Remove a feature from an existing component
argument-hint: component-name "feature to remove"
allowed-tools: Task, Read, Grep
---

Based on the request: $ARGUMENTS

Use the nimbus-component-orchestrator agent to remove the specified feature. The agent will:
1. Parse the component name and feature to remove from your request
2. Analyze the current component and identify the feature to remove
3. Plan proper deprecation strategy if needed
4. Update implementation, styling, documentation, and tests
5. Ensure clean removal without breaking dependent code

Focus on safe removal with clear migration path for users.