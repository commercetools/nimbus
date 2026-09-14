/**
 * System prompt for CALL 2 (see handle-chat-request.ts's header comment).
 * Built per request, not module-level like system-prompt.ts — it embeds the
 * specific topic/intent/reply from call 1, so there's nothing to gain from a
 * cacheable static prefix here.
 *
 * `chart-data-schema.ts` enforces field names and types; this text carries
 * what that schema can't: array-size ranges, date formatting, and — the
 * whole reason chart generation now passes the drafted reply into this
 * call — that the invented labels must actually match what the reply already
 * told the user, not a generic stand-in vocabulary. That mismatch (a reply
 * about a gender breakdown next to a chart labeled with RFM segments) is
 * exactly the bug that motivated authoring chart data with the LLM again
 * instead of a fixed local vocabulary — see response-schema.ts's header
 * comment for the full history.
 */
import type { ChatChartDescriptor, ChatChartKind } from "./chart-kinds";

const KIND_DATA_GUIDANCE: Record<ChatChartKind, string> = {
  scalar:
    'a single number matching the topic\'s metric. For intent "TARGET", ' +
    '"data" is 0-100 and "options" may include {"min":0,"max":100,' +
    '"threshold":<number>,"label":"<name>"}; for intent "VALUE", "options" ' +
    'may include {"label":"<name>","previous":<number>}.',
  series:
    'an array of 1-2 rows, each {"id","label","data":[{"x","y"}]}. "x" an ' +
    'ascending date string, "y" a number (or null for a gap). Match ' +
    "granularity to the topic: a single day's hourly breakdown needs 24 " +
    'points with "x" as a full ISO datetime ("2026-03-14T00:00:00" through ' +
    '"...T23:00:00"); a daily/weekly view needs 5-9 points with "x" as ' +
    '"YYYY-MM-DD"; a monthly view needs 6-12.',
  category:
    'an array of 4-8 {"category","value"} rows. "category" values must be ' +
    "the actual named things the topic/reply are about — never default to " +
    "a generic list like RFM segments unless the topic is genuinely about " +
    'recency/frequency segments. "options" may include {"target":<number>}.',
  "stack-row":
    'an array of 3-6 {"category","segments":[{"key","value"}]} rows, every ' +
    "row sharing the same 2-4 segment keys.",
  scatter: 'an array of 15-40 {"x","y","label"?,"group"?} points.',
  "heat-row":
    'an array of rows {"label","values":[numbers]}, every row the same ' +
    'length. "options" includes {"columnLabels":[strings]} naming each ' +
    'column, matching each row\'s "values" length.',
  funnel:
    'an array of 4-6 {"stage","value"} rows, top-to-bottom in the order ' +
    "customers pass through, each value normally at or below the one " +
    "before it.",
  "slope-row":
    'an array of 3-5 {"id","label","left","right"} rows. "options" ' +
    'includes {"leftLabel","rightLabel"} naming the two moments (e.g. ' +
    '"Q1"/"Q2").',
  "dumbbell-row":
    'an array of 3-6 {"category","start","end"} rows. "options" includes ' +
    '{"startLabel","endLabel"} naming the two things compared.',
  bubble: 'an array of 6-10 {"x","y","size","label","group"?} points.',
  "radar-series":
    'an array of 2-3 {"id","label","values":[numbers]} rows, every row the ' +
    'same length. "options" includes {"axes":[strings]} naming each axis, ' +
    'in the same order as "values".',
  "parallel-row":
    'an array of 5-8 {"id","group"?,"values":{"v1","v2","v3","v4"}} ' +
    "records (the keys are always exactly v1-v4, regardless of topic). " +
    '"options.dimensions" is REQUIRED: an array of exactly 4 {"key",' +
    '"label"} pairs, one per v1-v4, giving each its real human label for ' +
    'this topic (e.g. {"key":"v1","label":"Price"}) — this is where the ' +
    "topic's real dimension names actually go.",
  calendar:
    'an array of 40-70 sparse {"date","value"} rows, "date" a ' +
    '"YYYY-MM-DD" string, across 2-3 consecutive months (skip some days).',
  rfm:
    'an array of 15-22 {"recency","frequency","count","value"} cells, ' +
    '"recency"/"frequency" each 1-5 (a slightly sparse 5x5 grid).',
  samples:
    "a flat array of 100-300 plain numbers, roughly bell-shaped around a " +
    "sensible center.",
  "box-group":
    'an array of 3-5 {"label","min","firstQuartile","median",' +
    '"thirdQuartile","max","outliers":[numbers]} rows, values ascending ' +
    "within each row.",
  "delta-steps":
    'an array of {"label","value","isTotal"?} steps: the first and last ' +
    'have "isTotal": true (the start and end totals); the steps between ' +
    "are signed contributions (negative where something subtracts) that " +
    "sum with the start to equal the end.",
  "bullet-row":
    'an array of 3-5 {"label","measure","target","ranges":[number,number,' +
    'number]} rows, "ranges" ascending qualitative bands.',
  "flow-graph":
    '{"nodes":[{"name"}],"links":[{"source","target","value"}]} — ' +
    '"source"/"target" are 0-based indexes into "nodes", not names. 5-8 ' +
    "nodes, 5-9 links, no cycles.",
  hierarchy:
    'a FIXED 2-level tree: {"name","children":[<branch>]}. Each <branch> ' +
    'is {"name","value"?,"children"?:[{"name","value"}]} — EITHER "value" ' +
    '(the branch is itself a leaf) OR "children" (a list of plain ' +
    '{"name","value"} leaves), never both, and never a third level. 3-5 ' +
    "top-level branches, 2-3 children each for the ones that have children.",
  "sample-groups":
    'an array of 3-4 {"label","samples":[numbers]} rows, 40-80 numbers ' +
    "each.",
  ohlc:
    'an array of 15-30 consecutive {"date","open","high","low","close"} ' +
    'rows, "date" a "YYYY-MM-DD" string, "high" at or above ' +
    'max(open,close) and "low" at or below min(open,close).',
  "timeline-events":
    'an array of 5-8 {"label","start","end"?,"category"?} rows, ' +
    '"start"/"end" as "YYYY-MM-DD" strings, omit "end" for a single-point ' +
    "milestone.",
  "flow-matrix":
    '{"labels":[strings],"matrix":[[numbers]]} where "matrix" is ' +
    "labels.length x labels.length with 0 on the diagonal.",
};

export function buildDataSystemPrompt(
  descriptor: ChatChartDescriptor,
  reply: string
): string {
  return `You are the second step of a two-step mock commerce-analytics chart
generator, embedded in the Nimbus design system's documentation site. Every
number and label you produce is synthetic and illustrative only — there is no
real store data behind this.

The first step already chose what to visualize and already sent this reply to
the user:
"${reply}"

Topic: ${descriptor.topic}
Intent: ${descriptor.intent}

Invent a plausible, internally consistent synthetic dataset for a
"${descriptor.kind}" chart matching that topic and reply EXACTLY — every
category, segment, or entity name in "data" must be one the reply actually
mentions or clearly implies, never a generic stand-in vocabulary picked
because it was easier to reach for. That mismatch (a reply describing one
breakdown next to a chart labeled with an unrelated stock list) is the single
most common way this chart goes wrong.

Shape for "${descriptor.kind}": ${KIND_DATA_GUIDANCE[descriptor.kind]}

Never add a field beyond the ones named above — even a plausible-sounding
extra will be rejected. Keep numbers sensible for the persona implied by the
topic (round to a sensible precision, no negative counts unless the metric is
explicitly signed).`;
}
