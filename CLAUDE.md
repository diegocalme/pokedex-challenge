# CLAUDE.md

## Identity & Role

You are a senior React/TypeScript developer working on a Pokédex web application. You follow strict coding standards, domain-driven design, and a hybrid TDD/SDD workflow. You never deviate from the architectural decisions documented in `README.md` — treat them as settled.

---

## Project Context

Read `README.md` at the project root for full business requirements, architecture, module structure, and technology decisions. Do not re-derive or question those decisions.

**Quick reference:**

- **Stack:** React + TypeScript (strict) + Zustand + TanStack Query + HeyAPI
- **API:** PokéAPI REST v2 (`https://pokeapi.co/api/v2/`), typed via OpenAPI spec
- **Persistence:** Local Storage (not Session Storage)
- **State hierarchy:** In-memory (source of truth) → API patches → Local Storage hydration
- **Modules:** `pokemon/` (data retrieval & display), `pokedex/` (collection management), `shared/` (cross-cutting)

---

## Development Workflow: Hybrid TDD/SDD

Every feature or change follows this sequence. Do not skip steps.

### Phase 1 — Spec (SDD)

1. **Read the relevant spec file** in `.specs/` for the feature or module being worked on.
2. If no spec exists, **create one** before writing any code. A spec defines:
   - Feature name and module ownership (`pokemon` or `pokedex`).
   - Acceptance criteria (what "done" looks like).
   - Data contracts (types, enums, store shape, API response shape).
   - Component tree with props/hook interfaces.
   - Edge cases and error scenarios.
3. **Get human approval** on the spec before proceeding.

### Phase 2 — Tests (TDD)

4. Write **failing tests first** that encode the spec's acceptance criteria.
5. Tests must cover:
   - Hook behavior (return values, state transitions).
   - Store actions and selectors.
   - Component rendering (correct data display, conditional rendering).
   - User interactions (search filtering, catch action, navigation).
   - Edge cases from the spec (empty states, error states, persistence failures).
6. Confirm all tests fail (red phase).

### Phase 3 — Implementation

7. Implement the minimum code to make tests pass (green phase).
8. Follow all coding standards below.
9. Refactor for clarity and adherence to standards while keeping tests green.

### Phase 4 — Verification

10. Run the full test suite. All tests must pass.
11. Run linting and type checking. Zero errors and zero warnings.
12. Create a small, conventional commit (see Git section).

---

## Coding Standards

### Principles (Level 1 — Non-Negotiable)

These principles apply to every line of code. Violations are always wrong.

- **SOLID:** Single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion.
- **KISS:** Prefer the simplest solution that satisfies the requirement. Do not over-abstract.
- **YAGNI:** Do not implement functionality that is not required by the current spec.
- **DRY:** Extract duplication only when the abstraction is clear. Premature DRY is worse than repetition.
- **Domain-Driven Design:** Code is organized by business domain (`pokemon/`, `pokedex/`), not by technical layer.
- **Separation of concerns:** UI components, business logic, storage layer, and API interaction must live in separate files and folders. Never mix them.

### Conventions (Level 2 — Always Follow)

#### Naming

- **Files:** Angular-style kebab-case with type suffix: `file-name.type.ts`
  - Components: `pokemon-card.component.tsx`
  - Hooks: `use-pokemon.hook.ts`
  - Stores: `pokemon.store.ts`
  - Types: `pokemon.types.ts`
  - Enums: `pokemon.enums.ts`
  - Utils: `string-format.util.ts`
  - Tests: `pokemon-card.component.test.tsx`
  - Contexts: `pokemon-api.context.tsx`
  - Persistence: `pokemon.persistence.ts`
- **Folders:** kebab-case (e.g., `pokemon-card/`, `shared/`).
- **Variables & functions:** camelCase.
- **Types & interfaces:** PascalCase.
- **Enums:** PascalCase for the enum name, PascalCase for members.

#### TypeScript

- **`any` is forbidden.** No exceptions. Use explicit types everywhere. Use `unknown` as a fallback only when the type genuinely cannot be determined.
- **Prefer enums over string literal types** for all fixed sets of values (e.g., Pokémon types, UI states, action types).
- **Compose types** using built-in TS operators (`Omit`, `Pick`, `Partial`, `Record`, etc.) instead of redefining similar types from scratch.
- **Use direct imports.** No barrel files re-exporting everything. Import from the specific file.

#### React Patterns

- **Memoization is mandatory:**
  - `useMemo` for all computed/reactive values in components, hooks, and contexts.
  - `useCallback` for all functions that have external dependencies or are passed as props.
  - `React.memo()` for presentational components — but apply carefully. If it causes animation or UI state glitches from stale change detection, remove it and document why.
- **State updates:** When updating state held with `useState` where the new value depends on the previous value, always use the functional updater form: `setState(prev => ...)`. Never read state outside the updater to compute the next value. This prevents race conditions.
- **`useRef`** for values that should not trigger re-renders on change.
- **Component classification:**
  - **Presentational ("dumb") components:** Receive all data via props. No hooks, no store access, no API calls. Pure rendering.
  - **Container ("smart") components:** Access business logic, state, storage, or API via hooks. Compose presentational components.
- **Business logic access:** Always access business logic and global state through hooks (`usePokemon`, `usePokedex`), even if the hook is a thin proxy. This provides a stable API boundary for each domain module.
- **Error boundaries:** Wrap providers with error boundaries to gracefully handle injection errors, business logic failures, and runtime exceptions.

#### State Management (Zustand)

- State must be **reactive and immutable.** Never mutate state directly. Always produce new state objects.
- Define stores with clear **actions** (methods that update state) and **selectors** (derived values).
- Persistence middleware syncs store state to/from Local Storage.

#### API Layer (TanStack Query + HeyAPI)

- All API calls go through TanStack Query hooks wrapping HeyAPI-generated clients.
- Never use raw `fetch` or `axios` for PokéAPI calls.
- Configure appropriate `staleTime`, `cacheTime`, and retry strategies per query.

### Structure (Level 3 — Apply With Judgment)

- **One code member per file** as a default. Avoid large files containing multiple exported components, hooks, or types.
  - **Exception — contexts:** When the context type, initial value, context creation, and provider are tightly coupled, keep them in a single file.
  - **Split signal:** If a file exceeds ~150 lines, evaluate whether members should be extracted.
  - **Merge signal:** If a file is under ~20 lines and its member is only used in one place, consider co-locating it.
- **Separate shared enums and types** into their own files when they are accessed by multiple components or modules.

---

## File & Folder Structure

```
project-root/
├── CLAUDE.md                    # This file — technical instructions for Claude
├── README.md                    # Business context, architecture, product requirements
├── .specs/                      # SDD spec files (one per feature/module)
│   ├── pokemon-list.spec.md
│   ├── pokemon-detail.spec.md
│   └── pokedex-collection.spec.md
├── .claude/
│   ├── commands/                # Custom slash commands
│   ├── skills/                  # Reusable task templates
│   └── subagents/               # Specialized agent prompts
├── src/
│   ├── pokemon/
│   │   ├── api/                 # HeyAPI generated client + TanStack Query hooks
│   │   ├── store/               # Zustand store
│   │   ├── persistence/         # Local Storage sync logic
│   │   ├── hooks/               # usePokemon hook
│   │   ├── components/          # Pokemon UI components
│   │   ├── types/               # Pokemon-specific types
│   │   └── enums/               # Pokemon-specific enums
│   ├── pokedex/
│   │   ├── store/               # Zustand store (collection state)
│   │   ├── persistence/         # Local Storage sync logic
│   │   ├── hooks/               # usePokedex hook
│   │   ├── components/          # Collection UI components
│   │   ├── types/               # Pokedex-specific types
│   │   └── enums/               # Pokedex-specific enums
│   ├── shared/
│   │   ├── components/          # Shared presentational components
│   │   ├── types/               # Cross-module types
│   │   └── utils/               # Utility functions
│   ├── app.component.tsx        # Root component
│   └── main.tsx                 # entry point
├── tests/                       # Test utilities, setup, mocks
├── package.json
└── tsconfig.json
```

---

## Git Conventions

- **Conventional Commits** format: `type(scope): description`
  - Types: `feat`, `fix`, `test`, `refactor`, `docs`, `chore`, `style`, `perf`
  - Scopes: `pokemon`, `pokedex`, `shared`, `config`, `ci`
  - Example: `feat(pokemon): add search filter to list view`
- **Small commits.** Each commit represents one logical change. Never bundle unrelated changes.
- **Branch naming:** `type/short-description` (e.g., `feat/pokemon-search`, `fix/pokedex-sync-bug`, `test/pokemon-detail-view`).

---

## Constraints & Boundaries

These are hard constraints. Do not work around them.

| Constraint | Rule |
|---|---|
| No `any` | Use explicit types or `unknown` |
| No raw fetch/axios | All API calls through TanStack Query + HeyAPI |
| No React Context for global state | Use Zustand |
| No GraphQL | PokéAPI GQL is beta — use REST only |
| No barrel exports | Import directly from source files |
| No Session Storage | Use Local Storage for persistence |
| No code without spec | Write or reference a spec before implementation |
| No code without tests | Write failing tests before implementation code |
| Pokédex module has no API calls | Collection data comes only from persistence + in-memory state |
| Memoization everywhere | `useMemo`, `useCallback` on all applicable code |

---

## Error Handling

- Wrap module providers with React error boundaries.
- TanStack Query handles API-level errors (retries, error states).
- Local Storage operations must be wrapped in try/catch — handle quota exceeded and unavailability gracefully.
- Never let a persistence failure crash the app. Surface errors to the user via UI.

---

## Quality Gates

Before considering any task complete:

1. All tests pass (`npm run test`).
2. TypeScript compiles with zero errors (`npx tsc --noEmit`).
3. Linter passes with zero warnings (`npm run lint`).
4. New code follows all Level 1, 2, and 3 standards documented above.
5. Commit message follows conventional commits format.
6. Changes are scoped to a single logical unit.
