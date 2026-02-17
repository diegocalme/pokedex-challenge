# Command: /refactor

## Description

Audit existing, passing code against all CLAUDE.md standards, produce a violation report, then systematically fix violations while keeping every test green. This command never introduces new functionality — it only improves structure, naming, patterns, and standard adherence.

**No human gate required.** This command operates autonomously on code that already passes tests. Every change is verified against the test suite, and any change that breaks a test is reverted immediately.

---

## Usage

```
/refactor pokemon
/refactor pokedex
/refactor shared
/refactor src/pokemon/hooks/use-pokemon-list.hook.ts
/refactor all
/refactor pokemon --focus memoization
/refactor all --focus naming,types
```

---

## Arguments

| Argument | Required | Description |
|---|---|---|
| `scope` | Yes | Target: module name (`pokemon`, `pokedex`, `shared`), a specific file path, or `all`. |
| `--focus` | No | Comma-separated list of audit categories to restrict the review. Options: `naming`, `typescript`, `memoization`, `state`, `separation`, `structure`, `tests`. Defaults to all categories. |

---

## Execution Flow

### Step 1 — Pre-Flight

**1a. Verify green state.**

```bash
npm run test
```

If ANY test fails, **STOP immediately.** Output:

```
❌ Cannot refactor: {N} test(s) failing.
Fix failing tests first via /develop, then re-run /refactor.
```

Do not proceed under any circumstances.

**1b. Verify type check and linter baseline.**

```bash
npx tsc --noEmit
npm run lint
```

Record the baseline. If there are pre-existing errors or warnings, note them — the refactor should not increase them and should aim to reduce them.

**1c. Determine file set.**

| Scope Input | Files to Review |
|---|---|
| `pokemon` | All files under `src/pokemon/` |
| `pokedex` | All files under `src/pokedex/` |
| `shared` | All files under `src/shared/` |
| Specific file path | That single file |
| `all` | All files under `src/` |

### Step 2 — Audit

Delegate to the **code-reviewer** subagent (`.claude/subagents/code-reviewer.md`).

The code-reviewer reads `CLAUDE.md` and audits every file in scope against the applicable categories. If `--focus` restricts the categories, only those are checked.

**Audit categories:**

| Category | What's Checked |
|---|---|
| `naming` | File names, folder names, variables, functions, types, enums, test files. |
| `typescript` | `any` usage, string literals vs enums, type composition, `import type`, direct imports. |
| `memoization` | `useMemo` on computed values, `useCallback` on functions, `React.memo` on dumb components, functional state updater. |
| `state` | Immutability, store access only through hooks, persistence `partialize`, Local Storage error handling. |
| `separation` | UI/logic/storage/API in separate files, module boundaries respected, smart/dumb component boundary. |
| `structure` | One member per file, file length signals, shared types placement. |
| `tests` | AC/E traceability, mock usage, `userEvent` vs `fireEvent`, store reset in `beforeEach`, no `any` in tests. |

### Step 3 — Report

The code-reviewer produces a structured violation report grouped by severity:

```
## Code Review Report

**Scope:** {scope}
**Focus:** {categories or "all"}
**Files reviewed:** {count}
**Total violations:** {count}

### Critical ({count})
| # | File | Line | Rule | Description | Fix |
|---|---|---|---|---|---|

### High ({count})
| # | File | Line | Rule | Description | Fix |
|---|---|---|---|---|---|

### Medium ({count})
| # | File | Line | Rule | Description | Fix |
|---|---|---|---|---|---|

### Low ({count})
| # | File | Line | Rule | Description | Fix |
|---|---|---|---|---|---|
```

If there are **zero violations**, output:

```
✅ No violations found in {scope}. Code meets all standards.
```

And stop.

### Step 4 — Fix

The code-reviewer applies fixes in severity order: Critical → High → Medium → Low.

**For each fix or logical group of related fixes:**

1. Apply the change(s).
2. Run the full test suite:
   ```bash
   npm run test
   ```
3. **If any test fails** → revert the change immediately. Log:
   ```
   ⚠️ Reverted: {description}. Breaks test: {test name}. Flagged for manual review.
   ```
4. **If all tests pass** → run type check and linter:
   ```bash
   npx tsc --noEmit
   npm run lint
   ```
5. **If clean** → commit:
   ```bash
   git commit -m "refactor({scope}): {description}"
   ```

**Commit granularity:**
- One commit per logical fix group (e.g., "add `useMemo` to all derived values in `usePokemonList`").
- Unrelated fixes get separate commits.
- Never batch Critical and Low fixes in the same commit.

### Step 5 — Final Verification

After all fixable violations are addressed:

```bash
npm run test           # All tests pass
npx tsc --noEmit       # Zero errors
npm run lint           # Zero warnings
```

### Step 6 — Report

Output a refactor summary:

```
## /refactor Complete

**Scope:** {scope}
**Focus:** {categories}

### Results
- Violations found: {total}
- Violations fixed: {fixed}
- Violations reverted: {reverted} (broke tests — flagged for manual review)
- Violations deferred: {deferred} (Low severity, developer discretion)

### Commits
1. refactor({scope}): {message}
2. refactor({scope}): {message}
...

### Deferred Violations
| # | File | Line | Rule | Reason |
|---|---|---|---|---|

### Reverted Violations (Need Manual Review)
| # | File | Line | Rule | Broken Test |
|---|---|---|---|---|

### Quality Gate
- Tests: ✅ All passing ({count} tests)
- TypeScript: ✅ Zero errors
- Linter: ✅ Zero warnings
```

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Tests fail on pre-flight | STOP. Do not refactor. Report failing tests. |
| A fix breaks a test | Revert immediately. Log as "needs manual review." Continue with next violation. |
| A fix introduces new lint warnings | Fix the warnings before committing, or revert if the warnings can't be resolved. |
| A fix creates a new type error | Fix the type error before committing, or revert if the error is a side effect of a deeper issue. |
| Scope is `all` and the codebase is large | Process one module at a time (`pokemon` → `pokedex` → `shared`) to keep commits focused. |
| No violations found | Report clean state and stop. No unnecessary commits. |

---

## Constraints

- This command NEVER introduces new functionality or changes behavior.
- This command NEVER modifies or removes tests to make refactoring "work."
- This command NEVER commits code that breaks any test.
- This command NEVER skips the pre-flight green state check.
- This command NEVER batches unrelated fixes into a single commit.
- If code has no tests, this command flags it as untested and recommends adding tests before refactoring. It does NOT refactor untested code.
