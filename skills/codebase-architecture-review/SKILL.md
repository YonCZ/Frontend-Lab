---
name: codebase-architecture-review
description: Read-only architecture audit for an unfamiliar repository. Use when asked to review codebase structure, module and runtime boundaries, dependencies, data flow, legacy architecture, or how to make a repository safer for agent-generated changes. Explores the actual system, cites evidence, and proposes an incremental migration rather than imposing a standard folder tree.
---

# Codebase architecture review

Review the repository as it exists. Do not edit files, install dependencies, create branches, or apply a migration during this skill. The deliverable is a prioritized critique with enough evidence and detail for another agent to implement.

Do not assume a language, framework, deployment model, or preferred directory layout. Do not apply recommendations from previous repositories. The repository's instructions, executable code, configuration, tests, and observed workflows are the evidence.

## 1. Establish scope and instructions

1. Read the root `AGENTS.md` and equivalent contributor instructions. Read scoped instruction files before entering their directories.
2. Read the README, package or project manifests, workspace configuration, lockfiles, ignore files, CI configuration, and architecture documentation.
3. Inventory every top-level directory and every workspace or deployable component. Distinguish:
   - Hand-written application and library source.
   - Tests and development tools.
   - Generated source and checked-in build output.
   - Experimental prototypes and examples.
   - Vendored third-party code and external dependencies.
4. Identify the build system, test runner, languages, execution runtimes, and persistence technologies.
5. Record missing dependencies, unreadable files, and areas sampled rather than inspected. Never claim full coverage after a partial search.

Exclude dependency directories, caches, build output, and generated files from ordinary source searches unless the task concerns their generation or publication.

## 2. Build a system map from code, not documentation alone

Find the real entry points for every application, service, command-line tool, worker, library, and generated-code process. Trace a small set of representative workflows through the code. Include the most common workflow and the highest-risk workflow when identifiable.

For each traced workflow, identify:

- External callers and user-facing entry points.
- Calls across process, network, browser, worker, or service boundaries.
- Validation, authorization, error handling, and transaction boundaries.
- Mutable state owners and persistent data stores.
- Background work, retries, scheduled jobs, and event consumers.
- Shared contracts, serialization formats, and generated types.
- Tests or runtime checks that cover the workflow.

Check whether the documentation matches the implementation. Cite important mismatches instead of treating either source as authoritative without evidence.

## 3. Review the architecture

Evaluate only dimensions relevant to this system.

### Module and dependency structure

- Trace imports and calls before claiming coupling, duplication, dead code, or cycles.
- Check whether business rules depend on frameworks, transport code, UI code, or infrastructure in ways that block testing or reuse.
- Look for unrelated responsibilities sharing a module, repeated orchestration, hidden global state, and public APIs that expose internal details.
- Prefer the smallest boundary that fixes the observed problem. Do not recommend a layer, service, package, or abstraction because it appears in a reference architecture.

### Runtime and trust boundaries

- Check for browser imports of server-only code, secrets shipped to clients, workers importing incompatible runtime APIs, and untrusted input crossing a boundary without validation.
- Confirm whether a folder convention matches the actual deployment and dependency graph. A folder name alone is not a security boundary.
- Check generated or experimental code separately. Review how the repository builds, isolates, verifies, and publishes it. Do not force host-application component conventions onto prototypes whose purpose is design exploration.

### State, data, and contracts

- Identify the owner of each important piece of state and each write path.
- Check API, event, database, and job contracts for drift between producers and consumers.
- Prefer a shared machine-readable contract when multiple languages or runtimes interpret the same data.
- Recommend explicit state models only when competing states or transitions cause real complexity. Do not introduce a state-machine library for a simple form.

### Change and failure behavior

- Look for code paths that require coordinated manual edits in several places for one routine change.
- Check failures that leave partial writes, stale generated output, inconsistent registrations, or unrecoverable state.
- Review tests as evidence of intended contracts, not merely as files that increase coverage.

## 4. Calibrate every recommendation

Classify each issue as one of:

- **Observed defect:** Code, a reproducible failure, or an inconsistent contract proves incorrect behavior.
- **Structural risk:** The current design makes a concrete recurring mistake or unsafe change likely.
- **Local cleanup:** A bounded change improves clarity without altering the system design.

Do not report personal style, file length, folder naming, or use of a particular API as an architectural defect without a concrete failure mechanism.

Choose the weakest mechanism that reliably prevents each problem:

1. API or data design that makes the invalid operation unrepresentable.
2. Module, package, runtime, or ownership boundary.
3. Compiler, schema validation, or dependency-checking rule.
4. Runtime assertion, regression test, or end-to-end verification.
5. Focused contributor instructions.
6. Human review for security, data loss, concurrency, migration, and other judgment-heavy risks.

Do not replace human review of high-risk changes with screenshots or passing checks. Do not prescribe blanket bans on `useEffect`, timers, type assertions, or suppression comments. Review misuse and define scoped, justified exceptions.

For legacy code, prefer incremental adoption. Use new-module boundaries, per-directory checks, or measured legacy baselines. Do not recommend a repository-wide rewrite unless safer incremental options cannot address the observed problem.

## 5. Validate the findings

Before reporting a finding:

1. Gather exact file and line references.
2. Search callers, implementations, tests, and configuration that could contradict it.
3. Separate what the code proves from what you infer.
4. Run an existing diagnostic only if it is relevant, available, and does not modify source. Record the exact command and result.
5. Mark anything not executed or not fully inspected as unverified.

Never invent an error, dependency cycle, vulnerability, test failure, or repository convention.

## 6. Deliver the review

Use this structure and omit sections only when they have no relevant content.

```text
# Architecture review

## Scope and confidence
Repositories and components inspected, diagnostics run, generated or sampled areas, and limits.

## Current system map
Entry points, runtimes, important modules, data stores, external services, and generated-code flow.

## Findings
Ordered by priority and implementation dependency, not by directory.

## Proposed target structure
Include only when the current structure contributes to a finding. Map old locations to new ones and state compatibility constraints.

## Migration sequence
Small independently verifiable stages. Include rollback or compatibility steps where needed.

## Existing decisions worth preserving
Name healthy patterns that future changes should follow.

## Open questions
Only questions whose answers would materially change a recommendation.
```

Write each finding in this form:

```text
### [P0|P1|P2|P3] Short title

Classification: Observed defect, structural risk, or local cleanup.
Evidence: Exact paths, lines, symbols, flows, or command results.
Impact: A concrete failure or recurring maintenance cost.
Recommendation: The smallest coherent change, including what not to change.
Enforcement: Architecture, schema, compiler, lint, test, runtime check, prose, or review.
Migration: Ordered steps that preserve working behavior during adoption.
Verification: The result that proves the change worked and did not regress behavior.
```

Use severity consistently:

- `P0`: Active security exposure, data loss, broken production behavior, or an unusable primary workflow.
- `P1`: A failed contract or a high-confidence structural cause of recurring defects.
- `P2`: A maintainability problem with a bounded, realistic change.
- `P3`: Optional cleanup that should follow higher-priority work.

Do not pad the report with low-value findings. Explain why the top few matter and give another agent enough detail to act without repeating the whole exploration.

## Completion checklist

- All owned top-level areas and workspaces were accounted for.
- The system map came from executable entry points and representative traces.
- Every finding has evidence, impact, a scoped remedy, migration, and verification.
- Generated, prototype, and third-party code received appropriate treatment.
- Recommendations preserve public behavior unless a defect requires a change.
- The plan favors deterministic enforcement and incremental adoption.
- No files were changed during the review.
