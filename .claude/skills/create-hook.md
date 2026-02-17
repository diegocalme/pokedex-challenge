# Skill: Create Hook

## Purpose

Scaffold a domain hook that serves as the public API boundary for a module. Hooks centralize access to stores, persistence, API queries, and derived logic. Even thin proxy hooks are required — they decouple consumers from internal implementation details.

---

## Inputs

| Input | Required | Description |
|---|---|---|
| `hookName` | Yes | Full hook name with `use` prefix (e.g., `usePokemonList`, `usePokedex`) |
| `module` | Yes | Target module: `pokemon`, `pokedex`, or `shared` |
| `returnType` | Yes | TypeScript interface defining the hook's return shape |
| `dependencies` | Yes | List of stores, queries, or other hooks this hook consumes |
| `specFile` | No | Path to the relevant `.specs/` file for acceptance criteria reference |

---

## Procedure

### Step 1 — Determine File Paths

Convert `hookName` from camelCase to kebab-case for file naming.

```
src/{module}/hooks/
├── {kebab-name}.hook.ts           # Hook implementation
└── {kebab-name}.hook.test.ts      # Hook tests
```

**Example:**
- `usePokemonList` in `pokemon` module →
  - `src/pokemon/hooks/use-pokemon-list.hook.ts`
  - `src/pokemon/hooks/use-pokemon-list.hook.test.ts`

### Step 2 — Define Return Type

If the return type interface doesn't already exist in the module's `types/` directory, create it there. The hook file imports it — never define the return type inline.

```typescript
// src/{module}/types/{hook-name}-return.types.ts
export interface {ReturnTypeName} {
  // All fields with JSDoc descriptions
}
```

### Step 3 — Generate Hook File

```typescript
import { useMemo, useCallback } from 'react';
// Import store hooks, TanStack Query hooks, etc.

export function {hookName}({params}): {ReturnTypeName} {
  // 1. Access stores and queries
  const storeValue = use{Module}Store((state) => state.field);
  
  // 2. Memoize ALL derived/computed values
  const derivedValue = useMemo(() => {
    // computation from store or query data
  }, [dependency]);

  // 3. Memoize ALL action callbacks
  const handleAction = useCallback(({params}) => {
    // delegate to store action or mutation
  }, [dependency]);

  // 4. Return the public API — nothing internal leaks
  return useMemo(() => ({
    derivedValue,
    handleAction,
    // ...
  }), [derivedValue, handleAction]);
}
```

**Rules:**
- `useMemo` on every computed/derived value. No exceptions.
- `useCallback` on every function returned to consumers or with external dependencies.
- The return object itself SHOULD be memoized with `useMemo` to prevent unnecessary re-renders in consumers.
- Never expose store internals (actions, raw state shape) directly. Transform and name them for the consumer's use case.
- Use `useRef` for values that should not trigger re-renders.
- When updating state that depends on previous state, always use the functional updater form: `setState(prev => ...)`.

### Step 4 — Generate Test File

```typescript
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { {hookName} } from './{kebab-name}.hook';

// Mock dependencies
vi.mock('@{module}/store/{store-file}', () => ({
  use{Store}: vi.fn(),
}));

describe('{hookName}', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => {hookName}());
    // assert initial return values
  });

  it('should derive computed values correctly', () => {
    // setup mock store state
    const { result } = renderHook(() => {hookName}());
    // assert derived values
  });

  it('should handle actions', () => {
    const { result } = renderHook(() => {hookName}());
    act(() => {
      result.current.handleAction(/* params */);
    });
    // assert side effects
  });
});
```

**Test coverage requirements:**
- Initial return values match expected defaults.
- Derived values compute correctly from various store states.
- Actions delegate to the correct store methods.
- Edge cases from the spec file (if provided) are covered.
- Memoization stability: return references don't change on unrelated re-renders.

---

## Checklist

- [ ] File name follows `use-{name}.hook.ts` convention.
- [ ] Return type defined as a named interface in `types/`.
- [ ] Every computed value wrapped in `useMemo`.
- [ ] Every callback wrapped in `useCallback`.
- [ ] Return object memoized.
- [ ] No store internals exposed directly.
- [ ] No `any` type used.
- [ ] Functional updater form used for dependent state updates.
- [ ] Test file co-located in `hooks/` directory.
- [ ] Tests mock all external dependencies.
