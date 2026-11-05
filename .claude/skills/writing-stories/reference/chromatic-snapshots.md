# Chromatic Snapshots: What Gets Captured

### Chromatic Snapshots: What Gets Captured

The **visual snapshot role**. Snapshots are **opt-in**: `preview.tsx` defaults to
`disableSnapshot: true`; a story opts in with `disableSnapshot: false` + `tags:
["vrt"]`. Chromatic reads only `disableSnapshot`; `vrt` is just a label so tooling
can find snapshot stories. Crop padding is global (a `preview.tsx` decorator wraps
non-`fullscreen` stories in `1rem`), so focus rings aren't clipped.

Four questions decide every snapshot call, then a fifth step packs the survivors:

1. **Does it paint?** Is there a component-owned pixel at all.
2. **Is the state reachable in this frame?** Inert props, zeroing variants,
   inherited values with nothing to inherit, hover/pressed.
3. **Who owns the pixels?** Delegation to children, consumers, thin wrappers,
   composition patterns.
4. **Does the play land the frame?** End state, blur, settled animation,
   determinism.
5. **Packing the surfaces into frames.** Into as few as the axes allow.

**The rules themselves live in `docs/file-type-guidelines/stories.md`** (its
"Chromatic Visual Regression Snapshots" section) - terse rules plus paste-ready
snippets, already loaded by Required Research. This skill's **Chromatic
Snapshots** validation checklist repeats them as checkboxes under the same five
headings, and is what you tick off when validating.

**Escalate to `docs/chromatic-visual-testing.md` only when a rule doesn't settle
the case** - it is a long file of rationale and worked examples, so don't load
it by default. Read it when you hit one of these, because each is a call the terse
rule states but cannot decide for you. **Follow the link and read that section
only** - none of these needs the whole file:

- **Does this state paint differently from the default?** Read-only is the
  classic - the answer is component-dependent (MoneyInput yes, TextInput no).
  → [1. Does it paint?](../../../../docs/chromatic-visual-testing.md#1-does-it-paint)
- Any **"renders like default"** verdict you are about to write without having
  named the exact delta you checked.
  → [1. Does it paint?](../../../../docs/chromatic-visual-testing.md#1-does-it-paint)
- **One rule with a comma-separated selector list** - how many frames it needs.
  → [1. Does it paint?](../../../../docs/chromatic-visual-testing.md#1-does-it-paint)
- **A recipe variant that zeroes the surface**, or an inherited property with
  nothing to inherit - the state is inert in the default frame.
  → [2. Is the state reachable in this frame?](../../../../docs/chromatic-visual-testing.md#2-is-the-state-reachable-in-this-frame)
- **A focus ring possibly styled on a slot that never receives focus.**
  → [2. Is the state reachable in this frame?](../../../../docs/chromatic-visual-testing.md#2-is-the-state-reachable-in-this-frame)
- **A compound component with optional slots** - which arrangements are genuine
  surfaces rather than the same slots rearranged.
  → [3. Who owns the pixels?](../../../../docs/chromatic-visual-testing.md#3-who-owns-the-pixels)
- **Do these two axes interact, or are they independent?** Decides `SmokeTest`
  matrix vs. separate showcase stories.
  → [5. Packing the surfaces into frames](../../../../docs/chromatic-visual-testing.md#5-packing-the-surfaces-into-frames)

Rule of thumb: **auditing** a component's coverage for the first time → read it.
**Authoring** a story into an already-audited component, or fixing a play → don't.

**When a VRT pattern changes, sync all three canonical docs at their set depth** -
rationale and worked examples in `docs/chromatic-visual-testing.md`;
`docs/file-type-guidelines/stories.md` gets the terse rule + snippet; this file
gets the checklist item, under the matching numbered heading. One statement per
depth - don't restate a rule at two depths, or they drift.
