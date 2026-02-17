# Spec: Project Bootstrapping

## Module

`shared` (cross-cutting — affects entire project)

## Summary

The project exists as a bare Next.js application with none of the required dependencies, configuration, or folder structure in place. This spec defines every step needed to bring the project from its current state to a fully configured, ready-to-develop baseline: installing dependencies, configuring tooling, scaffolding the module folder structure, and verifying the setup compiles and passes an initial smoke test.

> **Architecture note:** The original architecture documents specified Vite as the build tool. Since the project is built on Next.js, its built-in Webpack/Turbopack bundler replaces Vite. All other architectural decisions (Zustand, TanStack Query, HeyAPI, Local Storage persistence, module structure) remain unchanged.

---

## Acceptance Criteria

### Dependencies

- [ ] AC-1: All runtime dependencies MUST be installed: `zustand`, `@tanstack/react-query`, `@hey-api/client-fetch`, `@hey-api/openapi-ts`.
- [ ] AC-2: All dev dependencies MUST be installed: testing framework (`vitest` + `@testing-library/react` + `@testing-library/jest-dom` + `@testing-library/user-event` + `jsdom`), linting (`eslint` with Next.js and TypeScript configs), and any additional type packages needed.
- [ ] AC-3: No unnecessary dependencies MUST be introduced. Every `package.json` entry must map to a documented architectural decision or tooling requirement.

### TypeScript Configuration

- [ ] AC-4: `tsconfig.json` MUST enforce strict mode (`"strict": true`).
- [ ] AC-5: `noUncheckedIndexedAccess` MUST be enabled for additional type safety on index signatures.
- [ ] AC-6: Path aliases MUST be configured for clean imports: `@pokemon/*`, `@pokedex/*`, `@shared/*` mapping to `src/pokemon/*`, `src/pokedex/*`, `src/shared/*` respectively.
- [ ] AC-7: The `any` type MUST be disallowed at the lint level (`@typescript-eslint/no-explicit-any` set to `error`).

### HeyAPI Client Generation

- [ ] AC-8: The PokéAPI OpenAPI spec MUST be referenced (from `https://raw.githubusercontent.com/PokeAPI/pokeapi/master/openapi.yml` or a local copy committed to the repo).
- [ ] AC-9: An `openapi-ts.config.ts` configuration file MUST be created to configure HeyAPI code generation targeting the `@hey-api/client-fetch` runtime.
- [ ] AC-10: A `generate:api` script MUST be added to `package.json` that runs HeyAPI code generation.
- [ ] AC-11: The generated client output MUST be placed in `src/pokemon/api/generated/` and MUST be gitignored (regenerated on demand, not committed).
- [ ] AC-12: A `.gitignore` entry MUST be added for the generated client directory.

### Testing Configuration

- [ ] AC-13: Vitest MUST be configured as the test runner with `jsdom` as the environment.
- [ ] AC-14: A `vitest.config.ts` (or `vitest.workspace.ts`) MUST be created with path alias resolution matching `tsconfig.json`.
- [ ] AC-15: A test setup file MUST be created at `tests/setup.ts` that imports `@testing-library/jest-dom` for extended matchers.
- [ ] AC-16: `package.json` MUST include scripts: `test` (run all tests), `test:watch` (watch mode), `test:coverage` (with coverage report).

### Linting Configuration

- [ ] AC-17: ESLint MUST be configured with Next.js core web vitals rules and TypeScript strict rules.
- [ ] AC-18: The `no-explicit-any` rule MUST be set to `error`.
- [ ] AC-19: `package.json` MUST include a `lint` script.

### Folder Structure

- [ ] AC-20: The following directory tree MUST be scaffolded under `src/`:

```
src/
├── pokemon/
│   ├── api/
│   │   └── generated/       # HeyAPI output (gitignored)
│   ├── store/
│   ├── persistence/
│   ├── hooks/
│   ├── components/
│   ├── types/
│   └── enums/
├── pokedex/
│   ├── store/
│   ├── persistence/
│   ├── hooks/
│   ├── components/
│   ├── types/
│   └── enums/
└── shared/
    ├── components/
    ├── types/
    └── utils/
```

- [ ] AC-21: Each directory MUST contain a `.gitkeep` file so empty folders are tracked in version control. These are removed once real files are added.

### Provider Scaffolding

- [ ] AC-22: A `QueryClientProvider` wrapper MUST be created at `src/shared/components/query-provider.component.tsx` that initializes a `QueryClient` with sensible defaults (stale time, retry count).
- [ ] AC-23: A root providers component MUST be created at `src/shared/components/app-providers.component.tsx` that composes all providers (QueryClientProvider, and future providers) in the correct nesting order.
- [ ] AC-24: The Next.js root layout (`app/layout.tsx`) MUST wrap its children with `AppProviders`.
- [ ] AC-25: `AppProviders` MUST be a client component (`'use client'` directive) since Zustand and TanStack Query require client-side React context.

### Error Boundary

- [ ] AC-26: A reusable error boundary component MUST be created at `src/shared/components/error-boundary.component.tsx`.
- [ ] AC-27: The error boundary MUST be wrapped around the providers in the root layout to catch initialization failures gracefully.

### Smoke Verification

- [ ] AC-28: After bootstrapping, `npm run build` MUST complete with zero errors.
- [ ] AC-29: `npx tsc --noEmit` MUST complete with zero errors.
- [ ] AC-30: `npm run lint` MUST complete with zero warnings and zero errors.
- [ ] AC-31: `npm run test` MUST execute successfully (a single placeholder test asserting `true` is sufficient to verify the runner works).
- [ ] AC-32: `npm run generate:api` MUST successfully generate the PokéAPI client in `src/pokemon/api/generated/`.

---

## Data Contracts

### Types

```typescript
/** QueryClient default options — defined in the query provider. */
interface QueryClientDefaults {
  queries: {
    staleTime: number;      // e.g. 5 * 60 * 1000 (5 minutes)
    retry: number;           // e.g. 2
    refetchOnWindowFocus: boolean; // false — manual control preferred
  };
}
```

### Enums

> No enums are introduced in this spec.

### Store Shape

> No stores are created in this spec. Store scaffolding is deferred to feature specs.

### API Response Shape

> The HeyAPI-generated client produces all API types. This spec only ensures generation works; the types themselves are defined by the OpenAPI spec.

---

## Component Tree

```
RootLayout (server component — app/layout.tsx)
└── ErrorBoundary (client component)
    └── AppProviders (client component)
        └── QueryClientProvider
            └── {children} (page content)
```

### Component Interfaces

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface AppProvidersProps {
  children: React.ReactNode;
}
```

---

## Hook API

> No hooks are introduced in this spec.

---

## Edge Cases & Error Scenarios

| # | Scenario | Expected Behavior |
|---|---|---|
| E-1 | `npm install` fails due to dependency conflicts | Resolve conflicts by aligning peer dependency versions. Document any resolutions in `package.json` `overrides` if needed. |
| E-2 | HeyAPI generation fails due to OpenAPI spec fetch error | Fall back to a locally committed copy of the spec file. Document the fallback in the `generate:api` script. |
| E-3 | OpenAPI spec has breaking changes upstream | The committed local copy provides stability. Updates to the spec are a deliberate, versioned action. |
| E-4 | Path aliases not resolving in tests | `vitest.config.ts` must mirror `tsconfig.json` path aliases via `resolve.alias`. |
| E-5 | Next.js server components importing client-only code | `AppProviders` and all Zustand/TanStack Query consumers must have `'use client'` directive. Server components must not import from these modules. |
| E-6 | ESLint conflicts between Next.js and TypeScript rule sets | TypeScript-specific rules take precedence. Disable conflicting Next.js rules where necessary and document the override. |

---

## Out of Scope

- Creating any Zustand stores (deferred to `pokemon-list.spec.md`, `pokemon-detail.spec.md`, `pokedex-collection.spec.md`).
- Implementing any feature hooks, components, or business logic.
- Routing or page creation beyond the default Next.js app router structure.
- CI/CD pipeline configuration.
- Environment variables or deployment configuration.
- Styling framework setup (CSS modules, Tailwind, etc. — to be decided separately).
- Git hooks (husky, lint-staged — can be added later).
