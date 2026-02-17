# Command: /develop

## Description

Full autonomous development lifecycle. Takes a spec file OR a product requirement as input and delivers tested, standards-compliant code with a conventional commit.

**Human gate:** The spec must be approved before implementation begins. If a spec is generated, execution pauses for approval.

---

## Usage

```
/develop .specs/pokemon-list.spec.md
/develop "Add search filter to the Pokémon list view"
/develop .specs/pokedex-collection.spec.md --pen designs/pokedex-collection.pen
```

---

## Arguments

| Argument | Required | Description |
|---|---|---|
| `input` | Yes | Either a path to an existing `.specs/*.spec.md` file, or a quoted product requirement / feature description. |
| `--pen` | No | Path to a Pencil `.pen` design file. When provided, components are generated to match the design via the Pencil MCP server. |

---

## Execution Flow

### Step 1 — Spec Resolution

**If input is a `.specs/` file path:**

1. Verify the file exists. If not, report error and stop.
2. Read the spec file.
3. Confirm with the developer: "Proceeding with spec `{filename}`. Is this approved for implementation?"
4. Wait for explicit approval. Do not proceed without it.

**If input is a product requirement (prompt text):**

1. Delegate to the **spec-writer** subagent (`.claude/subagents/spec-writer.md`).
2. The spec-writer reads `README.md`, `CLAUDE.md`, `_template.spec.md`, and all existing specs.
3. The spec-writer produces a complete spec file and saves it to `.specs/{feature-name}.spec.md`.
4. Present the generated spec to the developer for review.
5. **STOP and wait for human approval.** Do not proceed until the developer explicitly approves.
6. If the developer requests changes, revise the spec and re-present. Repeat until approved.

### Step 2 — Implementation

Once the spec is approved, delegate to the **implementer** subagent (`.claude/subagents/implementer.md`).

The implementer executes this sequence:

**2a. Preparation**
- Read the approved spec, `CLAUDE.md`, `README.md`, and all relevant skill files.
- Inventory existing code for reusable types, hooks, and components.
- Plan the implementation order (types → store → persistence → hook → components).

**2b. Red Phase**
- Read `.claude/skills/write-tests.md`.
- Create test data factories in `tests/factories/`.
- Write failing tests for every acceptance criterion (AC-N) and edge case (E-N).
- Run `npm run test` and confirm all new tests fail.
- Report red phase results: test count, AC coverage, edge case coverage.

**2c. Green Phase**
- Work layer by layer, reading the relevant skill file before each:
  - Types & Enums → read `create-type.md`
  - Store → read `create-store.md`
  - Persistence → read `create-persistence.md`
  - Hook → read `create-hook.md`
  - Components → read `create-component.md`
  - If `--pen` flag provided → read `design-sync.md`, use Pencil MCP to extract design values before generating component markup.
- After each layer, run `npm run test` to confirm progress.
- After all layers, run full suite — all tests (new and pre-existing) must pass.

**2d. Quality Gate**
```bash
npm run test           # All tests pass
npx tsc --noEmit       # Zero TypeScript errors
npm run lint           # Zero lint warnings
```

All three must pass with zero failures, zero errors, zero warnings.

**2e. Commit**
```bash
git add -A
git commit -m "feat({module}): {description from spec summary}"
```

### Step 3 — Report

Output an implementation summary:

```
## /develop Complete

**Spec:** {spec file path}
**Module:** {module}
**Design file:** {pen file path or "none"}

### Artifacts Created
- Types: {list}
- Store: {file path}
- Persistence: {file path or "N/A"}
- Hook: {file path}
- Components: {list}
- Tests: {list}
- Factories: {list}

### Coverage
- Acceptance Criteria: {N}/{total} covered
- Edge Cases: {N}/{total} covered
- Total new tests: {count}

### Quality Gate
- Tests: ✅ All passing
- TypeScript: ✅ Zero errors
- Linter: ✅ Zero warnings

### Commit
- {hash} feat({module}): {message}
```

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Spec file path doesn't exist | Report error, suggest creating via prompt input instead. |
| Spec has ambiguous acceptance criteria | Implementer halts and reports the ambiguity. Developer must clarify before resuming. |
| A dependency from another module is missing | Implementer halts and reports which spec should have produced it. Developer must run `/develop` on that spec first. |
| Tests won't fail in red phase (false positives) | Implementer fixes the assertions and re-verifies red state before proceeding. |
| Implementation breaks pre-existing tests | Implementer fixes the regression before proceeding. If unfixable, halts and reports. |
| Quality gate fails | Implementer fixes the issue and re-runs. Does not commit until the gate passes cleanly. |
| Pencil MCP is unavailable | Skip design sync. Generate components with semantic HTML and placeholder styles. Warn the developer that visual fidelity was not verified. |

---

## Constraints

- This command NEVER skips the spec approval gate.
- This command NEVER writes implementation code before tests.
- This command NEVER commits code that fails any quality gate check.
- This command NEVER implements anything listed in the spec's "Out of Scope" section.
- This command NEVER introduces `any`, raw fetch, React Context for global state, barrel exports, or any other item from the CLAUDE.md constraints table.
