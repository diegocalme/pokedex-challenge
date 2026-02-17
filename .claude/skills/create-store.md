# Skill: Create Store

## Purpose

Scaffold a Zustand store with immutable state, typed actions, selectors, and optional Local Storage persistence middleware. Stores are the single state authority within a module and must never be accessed directly by components — only through hooks.

---

## Inputs

| Input | Required | Description |
|---|---|---|
| `storeName` | Yes | PascalCase store name (e.g., `PokemonListStore`, `PokedexStore`) |
| `module` | Yes | Target module: `pokemon` or `pokedex` |
| `stateShape` | Yes | TypeScript interface defining the store's state fields |
| `actions` | Yes | List of action names with their signatures |
| `selectors` | No | List of derived/computed selector functions |
| `persisted` | No | Whether to include Local Storage persistence middleware (default: `false`) |
| `storageKey` | If persisted | Local Storage key name (e.g., `pokedex-collection`) |

---

## Procedure

### Step 1 — Determine File Paths

```
src/{module}/store/
├── {kebab-name}.store.ts           # Store definition
└── {kebab-name}.store.test.ts      # Store tests
```

**Example:**
- `PokedexStore` in `pokedex` module →
  - `src/pokedex/store/pokedex.store.ts`
  - `src/pokedex/store/pokedex.store.test.ts`

### Step 2 — Define Store Interface

The full store interface (state + actions + selectors) lives in the module's `types/` directory.

```typescript
// src/{module}/types/{store-name}.types.ts

export interface {StoreName}State {
  // State fields — data only, no functions
}

export interface {StoreName}Actions {
  // Action methods that update state
}

export interface {StoreName}Selectors {
  // Derived getter functions
}

export type {StoreName} = {StoreName}State & {StoreName}Actions & {StoreName}Selectors;
```

### Step 3 — Generate Store File

#### Without Persistence

```typescript
import { create } from 'zustand';
import type { {StoreName} } from '@{module}/types/{store-types-file}';

const initialState: {StoreName}State = {
  // Default values for all state fields
};

export const use{StoreName} = create<{StoreName}>()((set, get) => ({
  ...initialState,

  // Actions — always produce new state objects (immutable)
  setField: (value) => set({ field: value }),

  updateFromPrevious: (value) =>
    set((state) => ({
      field: [...state.field, value], // Spread, never mutate
    })),

  // Selectors — derived from current state
  derivedValue: () => {
    const state = get();
    return state.items.filter(/* ... */);
  },

  // Reset
  reset: () => set(initialState),
}));
```

#### With Persistence (Local Storage)

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { {StoreName} } from '@{module}/types/{store-types-file}';

const STORAGE_KEY = '{storageKey}';
const STORAGE_VERSION = 1;

const initialState: {StoreName}State = {
  // Default values
};

export const use{StoreName} = create<{StoreName}>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions
      setField: (value) => set({ field: value }),

      // Selectors
      derivedValue: () => {
        const state = get();
        return state.items.filter(/* ... */);
      },

      reset: () => set(initialState),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => {
        try {
          return localStorage;
        } catch {
          // Fallback: no-op storage when localStorage is unavailable
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
      }),
      partialize: (state) => ({
        // Explicitly list which state fields to persist.
        // Never persist status flags or transient UI state.
      }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.warn(`Failed to rehydrate ${STORAGE_KEY}:`, error);
          }
          // Mark hydration complete
          state?.setHydrated?.(true);
        };
      },
      // Future migration support
      migrate: (persistedState, version) => {
        // Handle schema migrations based on version number
        return persistedState as {StoreName}State;
      },
    }
  )
);
```

**Rules:**
- State is **immutable.** Never mutate arrays or objects in place. Always spread or produce new references.
- Actions use `set()` with either a partial state object or an updater function `(state) => ({...})`.
- Selectors use `get()` to read current state and derive values.
- Persisted stores MUST use `partialize` to control what is written to Local Storage. Never persist transient state like loading flags.
- Persisted stores MUST handle Local Storage errors gracefully (quota exceeded, unavailability).
- The `version` field enables future schema migrations without data loss.
- Initial state is defined as a separate constant for use by the `reset` action and tests.

### Step 4 — Generate Test File

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import { use{StoreName} } from './{kebab-name}.store';

describe('{StoreName}', () => {
  beforeEach(() => {
    // Reset store to initial state between tests
    act(() => {
      use{StoreName}.getState().reset();
    });
  });

  describe('initial state', () => {
    it('should have correct default values', () => {
      const state = use{StoreName}.getState();
      // assert defaults
    });
  });

  describe('actions', () => {
    it('should update state immutably via setField', () => {
      const previousState = use{StoreName}.getState();
      act(() => {
        use{StoreName}.getState().setField('newValue');
      });
      const nextState = use{StoreName}.getState();
      expect(nextState.field).toBe('newValue');
      expect(nextState).not.toBe(previousState); // Immutability check
    });
  });

  describe('selectors', () => {
    it('should derive values correctly', () => {
      // setup state
      act(() => {
        use{StoreName}.getState().setItems(testData);
      });
      const derived = use{StoreName}.getState().derivedValue();
      expect(derived).toEqual(/* expected */);
    });
  });
});
```

**Test coverage requirements:**
- Initial state matches expected defaults.
- Every action produces correct state transitions.
- State immutability is verified (new references, not mutations).
- Selectors return correct derived values for various state shapes.
- Edge cases: empty state, boundary values, duplicate handling.
- For persisted stores: hydration, fallback behavior, corrupted data handling.

---

## Checklist

- [ ] File name follows `{name}.store.ts` convention.
- [ ] Store interface split into State, Actions, and Selectors in `types/`.
- [ ] State is immutable — all updates produce new objects.
- [ ] Initial state defined as a reusable constant.
- [ ] `reset` action available for testing and cleanup.
- [ ] Persisted stores use `partialize` to exclude transient state.
- [ ] Persisted stores handle Local Storage errors gracefully.
- [ ] `version` field included for future migrations.
- [ ] No `any` type used.
- [ ] Test file co-located in `store/` directory.
- [ ] Tests reset store state in `beforeEach`.
