---
name: static-analysis-verification-review
description: Read-only audit of formatter, linter, type checker, schema, test, build, CI, and agent verification setup in an unfamiliar repository. Use when asked to design lint rules, improve static checks, add agent guardrails, create a verify command, or turn recurring code mistakes into deterministic feedback. Recommends scoped rules and incremental adoption instead of blanket API bans or a generic TypeScript configuration.
---

# Static analysis and verification review

Inspect the repository and propose a verification system grounded in its languages, code roles, actual defects, and contribution workflow. Do not edit configuration, install tools, add dependencies, suppress warnings, or apply fixes during this skill. Deliver an implementation-ready critique.

A green command is not the goal by itself. The goal is fast, relevant feedback that catches real regressions and tells the contributor how to fix them. Keep human review for risks that automated checks cannot establish.

## 1. Discover the existing toolchain

Read repository instructions first, including scoped `AGENTS.md` files. Then inspect:

- Package and project manifests, workspaces, lockfiles, and task-runner configuration.
- Formatter, linter, type checker, compiler, and schema configuration.
- Test configuration at unit, integration, browser, and end-to-end levels when present.
- Local development commands, CI jobs, release jobs, and required status checks.
- Ignore files and suppression baselines.
- Existing contributor documentation and agent instructions.
- Tests and history available in the checkout for evidence of recurring defects.

Inventory every language and workspace. Account for application source, tests, scripts, infrastructure, generated source, build output, examples, prototypes, and vendored code. Do not apply one rule set to all of them by default.

Do not infer the available commands from generic framework conventions. Read the scripts and CI definitions. If you run an existing check, ensure it does not modify source, then record the exact command, exit status, and important output. Never install missing tools merely to complete the audit.

## 2. Find the feedback gaps

Determine which failures the current system catches, where it catches them, and which reach human review or production.

Look for:

- Configured checks that CI never runs.
- CI checks with no equivalent documented local command.
- Source directories excluded from compilation or linting.
- Dependencies or scripts that make checks non-reproducible.
- Formatter and linter rules that conflict or rewrite the same syntax.
- Correctness rules disabled without evidence, and broad suppressions that hide unrelated failures.
- Different manifest, API, event, or job contracts implemented independently in several languages.
- Tests that assert implementation details while missing public behavior.
- Browser or screenshot requirements applied to non-UI changes.
- Slow checks placed in the inner loop while fast checks run late.
- Repeated agent mistakes addressed only by longer prose instructions.

Use evidence from code and configuration. A repository does not need every popular rule, test type, or strictness flag.

## 3. Review each deterministic layer

### Formatting

- Identify one formatter owner for each file type.
- Keep format-on-write separate from format checking in CI when appropriate.
- Exclude generated output, dependency directories, and build artifacts.
- Remove lint rules that only duplicate formatting decisions.

### Types and compilation

- Identify what the compiler actually includes and whether test, script, server, and prototype code receive appropriate checks.
- Recommend strictness based on migration cost and defect evidence. Do not demand every strict flag in one change.
- Inspect `any`, unsafe assertions, ignored compiler errors, and unchecked external data by context.
- Preserve valid negative type tests and reviewed interop exceptions. Require narrow scope and a reason rather than banning every exception.

### Lint and dependency rules

Prioritize rules that catch concrete correctness problems: invalid hooks, unreachable or incorrect control flow, unsafe imports, promise mistakes, dependency cycles, security hazards, and framework misuse supported by evidence.

For every proposed rule, specify:

- The exact file scope and excluded code roles.
- The defect it catches, with repository evidence when available.
- Whether an established plugin or compiler option already provides it.
- The autofix behavior, if a safe fix exists.
- An error message that explains the violated contract, the preferred replacement, and any valid exception process.
- The migration strategy for existing violations.
- The test or fixture that proves the rule catches bad code and accepts valid code.

Prefer existing maintained rules. Recommend a custom rule only for a repeated repository-specific problem with a reliable static signature. Do not attempt to enforce subjective comments, design taste, or broad notions of code quality with syntax rules.

Do not recommend blanket bans on `useEffect`, timers, animation APIs, `@ts-expect-error`, type assertions, or lint suppressions. Constrain proven misuse in product code while allowing focused abstractions, tests, generated files, and documented exceptions. If cycle detection is needed, recommend a tool that actually traverses the dependency graph; an import-path restriction alone does not detect cycles.

### Schemas and external contracts

When Node, Python, browser code, jobs, or external services interpret the same payload, look for a shared language-neutral schema or a reliable generated contract. Require runtime validation at untrusted boundaries. Static types alone do not validate JSON, requests, files, or environment variables.

### Formatters, generated code, and prototypes

Separate hand-written source checks from generated-source validity and generated-output checks. Generated design prototypes need build, runtime, interaction, and visual verification, not host-application restrictions on creative APIs. Check the generator, build record, publication step, and declared output contract as separate concerns.

## 4. Review the verification workflow

Design the smallest command set that gives clear ownership and avoids duplicate work.

### Fast local checks

Include only relevant existing tools, typically formatter checking, linting, type checking, and fast behavioral tests. Provide one canonical command when it reduces missed steps, but preserve individual commands for debugging.

### Build and integration checks

Verify production builds, database or service integration, generated contracts, packaging, and cross-runtime behavior when applicable. Do not equate a development-server success with a production-build success.

### End-to-end and visual checks

- Derive browser flows from user-facing behavior and project requirements.
- Assert state, requests, persistence, errors, and accessibility where relevant.
- Use screenshots for visual confirmation, not as a substitute for interaction assertions.
- Require artifacts appropriate to the change. A backend change may need contract tests and logs, not a screenshot.
- Keep slow end-to-end suites separate from the fast loop and define when each must run.

### CI behavior

Check clean checkout reproducibility, lockfile use, timeouts, caching correctness, concurrency, artifact retention, and required-check policy. Local and CI commands should share the same underlying tasks. Address flaky tests by diagnosis or a tracked, scoped quarantine, never by hiding the entire suite.

Do not impose an arbitrary coverage percentage, screenshot count, token-spending ratio, or recording requirement without evidence that it detects relevant failures.

## 5. Plan adoption without a warning flood

For a legacy repository, choose among:

- Enforce on new code and changed production directories first.
- Add per-directory or per-package opt-in.
- Establish a machine-readable baseline with a required reduction plan for high-value rules.
- Fix compiler inclusion and contract defects before adding stylistic rules.
- Pilot rules on one representative component, measure false positives, then expand.

Do not propose broad suppression, lowering severity, deleting failing tests, or checking in generated output merely to make verification pass. State how exceptions expire and who owns them.

Recommend concise `AGENTS.md` content only for knowledge that tools cannot enforce:

- Exact canonical commands and when to run them.
- Pointers to route, feature, schema, or ownership maps when those maps exist.
- Required evidence by change type.
- Project taste, copy, accessibility, and review judgment.
- The scoped exception process.

Keep specific rule definitions in machine-readable configuration and tests, not duplicated prose.

## 6. Deliver the audit

Use this structure:

```text
# Static analysis and verification review

## Scope and commands
Areas inspected and exact commands run, with exit status. List checks not run and why.

## Current verification map
Tool, configured scope, local command, CI command, code roles covered, and observed gaps.

## Findings
Prioritized by escaped risk and implementation dependency.

## Proposed rule plan
Only rules justified by the review, with scope, rationale, message, exceptions, migration, and rule tests.

## Proposed verification workflow
Fast, full, and CI checks using the repository's actual package manager and tools.

## Adoption sequence
Small stages with baseline handling, false-positive review, and success criteria.

## Prose and human review
The small set of instructions and reviews that should remain outside automation.
```

Write each finding as:

```text
### [P0|P1|P2|P3] Short title

Evidence: Exact configuration, source paths, lines, suppression counts, or command output.
Gap: The defect or regression that currently escapes, or the unnecessary contributor cost.
Recommendation: A specific tool, scope, and configuration direction without pretending it was applied.
Agent-facing message: Proposed error text when a new or changed rule is involved.
Migration: Existing-violation handling and staged rollout.
Verification: Rule tests, behavioral tests, command results, or artifacts that prove the gap closed.
```

Use `P0` for a disabled or absent check that permits an active severe security or data-loss path, `P1` for high-confidence escaped defects or broken primary verification, `P2` for useful incremental checks, and `P3` for optional cleanup. Explain unusual severity decisions.

Distinguish observed failures from proposed improvements. Do not invent configuration diffs, benchmark numbers, warning counts, test results, or command names.

## Completion checklist

- Every language, workspace, and code role has an explicit coverage decision.
- Local and CI behavior were compared from configuration.
- Each proposed rule has evidence, scope, remediation text, exceptions, migration, and tests.
- Strictness and baselines account for legacy migration cost.
- Generated and design prototype code are not subject to irrelevant host rules.
- Verification requirements match UI, API, library, data, and operational changes.
- Prose contains only judgment, navigation, and exact workflow instructions.
- No files or configuration were changed during the review.
