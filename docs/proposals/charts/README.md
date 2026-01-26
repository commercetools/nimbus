# Nimbus Charts Proposals

> **Parent Plan**: [nimbus-charts-plan.md](../nimbus-charts-plan.md)

## Overview

This directory contains individual proposal stubs for the
`@commercetools/nimbus-charts` package. Each proposal is designed to be worked
on in a **fresh conversation context**.

## Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                         FOUNDATION                               │
│                    00-foundation.md                              │
│                      (Blocks all)                                │
└───────────────────────────┬─────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  01-kpi-card  │  │02-line-chart  │  │ 03-bar-chart  │
│   (Phase 1)   │  │   (Phase 1)   │  │   (Phase 1)   │
└───────────────┘  └───────┬───────┘  └───────────────┘
                           │
            ┌──────────────┼───────────────┐
            ▼              ▼               ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│04-area-chart  │  │ 05-pie-chart  │  │06-funnel-chart│
│   (Phase 2)   │  │   (Phase 2)   │  │   (Phase 2)   │
└───────────────┘  └───────────────┘  └───────────────┘
```

## Proposals

| #   | Proposal                             | Status      | Dependencies   | Assignee |
| --- | ------------------------------------ | ----------- | -------------- | -------- |
| 0   | [Foundation](./00-foundation.md)     | Not Started | None           | -        |
| 1   | [KPI Card](./01-kpi-card.md)         | Not Started | #0             | -        |
| 2   | [Line Chart](./02-line-chart.md)     | Not Started | #0             | -        |
| 3   | [Bar Chart](./03-bar-chart.md)       | Not Started | #0             | -        |
| 4   | [Area Chart](./04-area-chart.md)     | Not Started | #0, ideally #2 | -        |
| 5   | [Pie/Donut Chart](./05-pie-chart.md) | Not Started | #0             | -        |
| 6   | [Funnel Chart](./06-funnel-chart.md) | Not Started | #0             | -        |

## Workflow

### Starting a New Proposal Session

1. **Open a fresh Claude conversation**

2. **Reference the proposal file:**

   ```
   I'm working on Proposal #X (Component Name) for nimbus-charts.
   See docs/proposals/charts/0X-component-name.md for scope.

   Let's brainstorm [specific aspect you want to explore].
   ```

3. **Use `/brainstorm`** to explore design decisions

4. **When ready, use `/openspec:proposal`** to create the formal specification

5. **Update the proposal status** in this README and the individual file

### Parallelization Guide

**Can work in parallel after Foundation (#0) is complete:**

- Phase 1: KPI Card (#1), Line Chart (#2), Bar Chart (#3)
- Phase 2: Area Chart (#4), Pie Chart (#5), Funnel Chart (#6)

**Recommended sequence:**

1. One person completes Foundation (#0)
2. Three people work on Phase 1 in parallel (#1, #2, #3)
3. Line Chart patterns inform Area Chart (but not a hard blocker)
4. Phase 2 can start as soon as Foundation is done

## Key Decisions (Summary)

These decisions were made during the initial brainstorm session:

| Decision          | Choice                                                       |
| ----------------- | ------------------------------------------------------------ |
| Rendering library | Visx                                                         |
| Package location  | Separate `@commercetools/nimbus-charts`                      |
| Accessibility     | React Aria focus management + custom announcements           |
| Token strategy    | Semantic aliases (`chart.1` → `colors.blue.9`)               |
| i18n              | Static text in `.i18n.ts`, data formatting via props         |
| Component API     | Simple props + compound composition (progressive disclosure) |

See [nimbus-charts-plan.md](../nimbus-charts-plan.md) for full details.
