# From People to Components — The Story of This Project

_Executive intro to the RFC doc set. Read this first; docs 01–04 are the detail hanging off this spine._

It starts with a person in front of a store's admin — and not one person, but a whole cast. An owner glancing at whether the week is up or down. A merchandiser deciding what to promote, a marketer judging which channel paid off, support watching the queue, operations watching the backlog, finance protecting the margin, an analyst chasing an odd number. They don't share a job, but they share a habit: all day, they ask their store questions. When do we sell most? What's leaking in checkout? Which accounts are slipping?

Until now, answering those questions meant one of two slow paths — a fixed dashboard someone built months ago that never quite asks *their* question, or a request to a data team that comes back next week. The questions are infinite and personal; the tools are finite and generic. That gap is the problem.

The agentic frontend closes it: the operator simply asks, in their own words, and a backend gathers whatever data it has and answers. But a raw answer — a number, a table — isn't understanding. People read *shape*: a line that climbs, a bar that towers over its neighbors, a slice that's bigger than it should be. So the answer isn't finished until it's drawn the right way. Which raises the real question behind the whole project: when a human can ask anything at all, who chooses the right picture?

It can't be a developer — there are too many possible questions to hand-design a chart for each. It can't be the merchant — they've done their part by asking. It has to be the agent. And for an agent to choose well, it needs two things: a catalog of visualizations to choose from, and a principled way to choose among them.

The principle turned out simpler than the sea of questions suggested. Strip away the commerce vocabulary and almost every question is really one of a handful of *intents* — is it trending, how does it rank, what's it made of, am I on track, is it in range, how do two things relate. And the data that answers it comes in a handful of *shapes* — a series over time, a set of categories, parts of a whole, a distribution. We checked this against the real work: seventeen personas, around two hundred questions, collapsing cleanly into fifteen intents and thirteen data shapes. Those two axes — not the domain data — are what let the agent match a question to a chart, which means the library can be built around humans and their questions and stay correct however the backend changes.

From there the visualizations nearly name themselves, and, reassuringly, they don't explode into hundreds. One chart earns its keep across many intents: a single time-series line answers "is it trending," and with a target line, a threshold band, or a benchmark it also answers "am I on track," "am I in range," and "how do I compare." So a small set of base chart families, a few composable overlays, and a specialist tail for things like funnels and cohorts — roughly fifty React components in all — cover the space. On top of them sits a catalog of around a hundred named, pre-configured presets: the menu the agent actually picks from.

And that is where we are now. The line is straight: real people with real jobs ask their stores real questions; those questions reduce to intents and data shapes; intents and shapes select visualizations; and those visualizations are the React components we're setting out to build — a curated, agent-selectable catalog on a small, themeable, lazy-loaded core. Everything else in the RFC is detail hanging off this spine.

---

**The chain, in one line:** people → questions → (intents × data shapes) → visualizations → React components (a small core + presets, selected at runtime by the agent).
