# nimbus-mcp package — search latency experiments

Autonomous search latency optimization for the `@commercetools/nimbus-mcp` MCP server.

## Setup

To set up a new experiment, work with the user to:

1. **Agree on a run tag**: propose a tag based on today's date (e.g. `mar19`). The branch `perf/nimbus-mcp/<tag>` must not already exist.
2. **Create the branch**: `git checkout -b perf/nimbus-mcp/<tag>` from current main.
3. **Read the in-scope files**: Read these for full context:
   - `packages/nimbus-mcp/src/server.ts` — MCP server definition and tool registration.
   - `packages/nimbus-mcp/src/data-loader.ts` — lazy JSON loading and Fuse.js instance caching.
   - `packages/nimbus-mcp/src/tools/` — all tool implementations (get-component, list-components, search-docs, list-tokens).
   - `packages/nimbus-mcp/src/utils/relevance.ts` — scoring and ranking.
   - `packages/nimbus-mcp/tsup.config.ts` — build configuration.
   - `packages/nimbus-mcp/package.json` — scripts and dependencies.
4. **Build the MCP package**: `pnpm --filter @commercetools/nimbus-mcp build`
5. **Create the benchmark script**: Create `packages/nimbus-mcp/bench.ts` (see Benchmark Script below).
6. **Initialize results.tsv**: Create `packages/nimbus-mcp/results.tsv` with the header row.
7. **Confirm and go**.

## Benchmark Script

Create `packages/nimbus-mcp/bench.ts` on the first run. It should import the tool handlers directly and call them with representative inputs.

```typescript
import { performance } from "node:perf_hooks";

// Adapt these imports to match the actual export structure.
// You may need to import the tool handler functions directly
// or instantiate the server and call tools through it.

interface BenchResult {
  name: string;
  avg: number;
  p50: number;
  p95: number;
  iterations: number;
}

async function bench(
  name: string,
  fn: () => Promise<unknown>,
  iterations = 100
): Promise<BenchResult> {
  // Warmup
  for (let i = 0; i < 10; i++) await fn();

  const times: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  const p50 = times[Math.floor(times.length * 0.5)];
  const p95 = times[Math.floor(times.length * 0.95)];
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  console.log(
    `BENCH: name=${name} avg=${avg.toFixed(2)} p50=${p50.toFixed(2)} p95=${p95.toFixed(2)}`
  );
  return { name, avg, p50, p95, iterations };
}

async function main() {
  // TODO: On first run, read the actual tool handler exports and adapt.
  // Example calls — adapt to the real function signatures:
  //
  // await bench("search-docs", () => searchDocs({ query: "button" }));
  // await bench("get-component", () => getComponent({ name: "Button" }));
  // await bench("list-components", () => listComponents({}));
  // await bench("list-tokens", () => listTokens({}));
  //
  // Also measure startup time:
  // const startupStart = performance.now();
  // await initializeServer();
  // console.log(`BENCH: name=startup avg=${(performance.now() - startupStart).toFixed(2)} p50=0 p95=0`);

  console.log("Adapt this script to import and call tool handlers directly.");
}

main().catch(console.error);
```

Adapt this on the first run — read the actual exports from `src/tools/` and `src/data-loader.ts`, then call them with representative queries like "button", "Select", "color token", "spacing".

## Running benchmarks

```bash
# Build first (tools import from compiled output or source via tsx)
pnpm --filter @commercetools/nimbus-mcp build > build.log 2>&1

# Run benchmark
npx tsx packages/nimbus-mcp/bench.ts > bench.log 2>&1

# Extract results
grep "^BENCH:" bench.log
```

**Primary metric**: `search_p95` — p95 latency of `search-docs` in ms. Lower is better.
**Secondary metrics**: `get_component_p95`, `list_components_p95`, `startup_ms`.
**Constraint**: All existing tests must pass. The MCP tool interface (names, parameter schemas, response shapes) must remain unchanged.

**What you CAN do:**
- Modify any file under `packages/nimbus-mcp/src/` — tool implementations, data loading, caching, indexing, search logic.
- Restructure Fuse.js configuration (weights, thresholds, keys, index options).
- Add pre-computed indexes or lookup tables in the prebuild step (`scripts/prebuild.ts`).
- Optimize the lazy data loading pattern (e.g. eagerly load at startup, use binary formats).
- Replace Fuse.js with a faster search implementation if warranted.
- Modify `packages/nimbus-mcp/tsup.config.ts` for build optimizations.

**What you CANNOT do:**
- Change the MCP tool interface (tool names, parameter schemas, response shapes).
- Remove tools or reduce functionality.
- Add dependencies that significantly increase bundle size (>100KB).
- Modify packages outside `packages/nimbus-mcp/`.

**The goal is simple: get the lowest search_p95.** The MCP server is called by AI assistants in real-time — every millisecond of latency is felt. Fuse.js instance caching is already critical (per project CLAUDE.md). Look for further gains in data structure, pre-computation, and algorithmic improvements.

**Simplicity criterion**: Pre-computing data at build time to avoid query-time work is ideal. A marginal latency gain from complex runtime caching is less valuable than a simple prebuild optimization.

**The first run**: Adapt the benchmark script to work with the actual codebase, then run the baseline.

## Output format

After each benchmark run, record:

```
search_p95:         12.34
get_component_p95:  5.67
list_components_p95: 2.10
startup_ms:         150
tests:              pass
```

## Logging results

Log each experiment to `packages/nimbus-mcp/results.tsv` (tab-separated).

```
commit	search_p95	get_component_p95	startup_ms	status	description
```

1. git commit hash (short, 7 chars)
2. search_p95 (search-docs p95 in ms)
3. get_component_p95 (get-component p95 in ms)
4. startup_ms (time to first tool call readiness)
5. status: `keep`, `discard`, or `crash`
6. short description of what was tried

## The experiment loop

LOOP FOREVER:

1. Look at the git state and results so far.
2. Modify in-scope files with an experimental idea.
3. git commit
4. Build: `pnpm --filter @commercetools/nimbus-mcp build > build.log 2>&1`
5. Benchmark: `npx tsx packages/nimbus-mcp/bench.ts > bench.log 2>&1`
6. Extract: `grep "^BENCH:" bench.log`
7. If no BENCH lines, the run crashed — `tail -n 50 bench.log` to diagnose.
8. Verify: `pnpm vitest run --config packages/nimbus-mcp/vitest.config.ts --silent > test.log 2>&1`
9. Record results in the TSV.
10. If search_p95 decreased AND tests pass, keep the commit.
11. If search_p95 increased or tests fail, `git reset --hard HEAD~1`.

**Timeout**: Each build + bench + test cycle should take under 3 minutes.

**Crashes**: Fix simple issues and retry. Log fundamentally broken approaches as crash and move on.

**NEVER STOP**: Run indefinitely until manually stopped. If stuck, try: different Fuse.js options (threshold, distance, ignoreLocation), pre-sorted data, trie or inverted index, pre-tokenized search corpus, or entirely different search libraries (e.g. MiniSearch, FlexSearch).
