---
description: Add a new feature to an existing component
argument-hint: component-name "feature description"
allowed-tools: Task, Read, Grep
---

Based on the request: $ARGUMENTS

Use the nimbus-component-orchestrator agent to add the requested feature. The agent will:
1. Parse the component name and feature description from your request
2. Analyze the existing component structure
3. Plan the feature addition while maintaining backward compatibility
4. Update implementation, styling, documentation, and tests as needed
5. Validate the changes don't break existing usage

Focus on adding the feature while preserving existing API and behavior.