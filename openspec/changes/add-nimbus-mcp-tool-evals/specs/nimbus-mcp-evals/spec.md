## Purpose

Guarantees that every nimbus-mcp tool keeps returning correct, useful and
compact results by running deterministic, reviewable eval cases against the
built server in CI.

## ADDED Requirements

### Requirement: Eval cases are declared per tool in a reviewable file
Each tool SHALL have one case file that names the tool and lists its cases.
Each case SHALL have a unique id, the exact input to send to the tool, and one
or more expectations drawn from a fixed vocabulary: `isError`, `contains`,
`notContains`, `field` (a JSON path equals a value), `rankWithin` (an array
element whose field equals a value appears within the first k, optionally with
further field/value checks on that element), `absent` (no
array element has the field/value), `length` (array length bounds) and
`maxChars` (response text length cap). A case file that uses an unknown
expectation or omits a required field SHALL fail the run before any tool is
called.

#### Scenario: Unknown expectation key
- **WHEN** a case declares an expectation key outside the vocabulary (e.g. a typo such as `contain`)
- **THEN** the eval run fails during case loading, naming the file, the case id and the offending key

#### Scenario: Valid case file
- **WHEN** a case file declares a tool name and cases with unique ids and only vocabulary expectations
- **THEN** every case is executed

### Requirement: Every registered tool is covered
The eval run SHALL list the tools the built server registers and SHALL fail if
any registered tool has fewer than three cases, if a case file names a tool the
server does not register, or if two cases share an id.

#### Scenario: Tool added without cases
- **WHEN** a new tool is registered and no case file exists for it
- **THEN** the eval run fails and names the uncovered tool

#### Scenario: Stale case file
- **WHEN** a case file names a tool that is no longer registered
- **THEN** the eval run fails and names the file

### Requirement: Cases run against the built artifact
The eval run SHALL execute each case by calling the tool on the built server
executable over the standard MCP transport, not against source modules, so the
result reflects what consumers install. If the built artifact is missing, the
run SHALL fail with a message that says to build the package first.

#### Scenario: Build missing
- **WHEN** the eval command runs before the package has been built
- **THEN** it fails immediately with a message naming the build command

#### Scenario: Expectation unmet
- **WHEN** a tool's response does not satisfy one of a case's expectations
- **THEN** the run fails, reporting the tool, case id, the expectation, the expected value and the actual value or an excerpt of the actual response

### Requirement: A scorecard is emitted
After all cases run, the eval SHALL write a scorecard containing, per tool, the
number of cases passed and failed, the median and maximum response size in
characters, and the median and maximum call duration in milliseconds. The
scorecard SHALL be written as a JSON file and, when running in GitHub Actions,
appended as a Markdown table to the job summary.

#### Scenario: Local run
- **WHEN** the eval runs outside GitHub Actions
- **THEN** the JSON scorecard is written and no job-summary write is attempted

#### Scenario: CI run
- **WHEN** the eval runs inside GitHub Actions
- **THEN** the Markdown scorecard appears in the job summary for that step

### Requirement: Evals gate the Build and Test workflow
The Build and Test workflow SHALL run the evals after the packages are built
and SHALL fail the job when the eval run fails.

#### Scenario: Regression on a pull request
- **WHEN** a pull request changes a tool so that a seed case no longer passes
- **THEN** the Build and Test check fails on that pull request

### Requirement: Seed cases cover known regressions
The initial case set SHALL include, for `search_docs`: a term that occurs only
deep in a page's implementation view is found with that view reported; a term
that occurs only on a page outside the first thirty alphabetical pages is
found; a multi-word query's snippet contains the words together; no snippet
contains leaked code-fence markers; every response is at most 4000 characters.
For the other tools it SHALL include at least three cases each, derived from
behaviour the existing unit specs already assert.

#### Scenario: Deep implementation term
- **WHEN** `search_docs` is called with `allowFocusWhenDisabled`
- **THEN** the Button page is within the first two results, its matched view is the implementation view, and the snippet contains the term

#### Scenario: Late-alphabet page
- **WHEN** `search_docs` is called with `tabListAriaLabel`
- **THEN** the Tabs page is in the results with its implementation view matched

#### Scenario: Response cap
- **WHEN** `search_docs` is called with any seed query and `limit: 10`
- **THEN** the response text is at most 4000 characters
