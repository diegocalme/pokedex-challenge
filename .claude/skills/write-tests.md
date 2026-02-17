# Skill: Write Tests

## Purpose

Generate a comprehensive test suite from a spec file's acceptance criteria and edge cases. Tests follow the TDD red phase — they encode what "done" looks like and MUST fail before any implementation code is written. Tests are organized by acceptance criterion and edge case, making traceability between spec and implementation explicit.

---

## Inputs

| Input | Required | Description |
|---|---|---|
| `specFile` | Yes | Path to the `.specs/` file to derive tests from |
| `targetModule` | Yes | Module the tests belong to: `pokemon`, `pokedex`, or `shared` |

---

## Procedure

### Step 1 — Parse the Spec

Read the spec file and extract:

1. **Acceptance criteria** — each becomes a `describe` block or individual test.
2. **Edge cases table** — each row becomes a test.
3. **Data contracts** — types, enums, and interfaces needed for test data factories.
4. **Component tree** — determines which components need rendering tests.
5. **Hook API** — determines which hooks need `renderHook` tests.
6. **Store shape** — determines which store tests need action/selector coverage.

### Step 2 — Generate Test Organization

Map spec sections to test files:

| Spec Section | Test File Location |
|---|---|
| Component: `{ComponentName}` | `src/{module}/components/{folder}/{name}.component.test.tsx` |
| Hook: `{hookName}` | `src/{module}/hooks/{name}.hook.test.ts` |
| Store: `{StoreName}` | `src/{module}/store/{name}.store.test.ts` |
| Persistence | `src/{module}/persistence/{module}.persistence.test.ts` |

### Step 3 — Generate Test Files

Each test file follows this structure:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
// Import testing utilities based on test type:
// - Components: render, screen, userEvent from @testing-library/react
// - Hooks: renderHook, act from @testing-library/react
// - Stores: direct store access via getState()

/**
 * Tests derived from: {specFile}
 *
 * Acceptance Criteria Coverage:
 * - AC-1: {description} → test: "should {behavior}"
 * - AC-2: {description} → test: "should {behavior}"
 * ...
 *
 * Edge Case Coverage:
 * - E-1: {scenario} → test: "should {expected behavior}"
 * ...
 */

describe('{FeatureName}', () => {
  // ─── Setup ─────────────────────────────────────────────
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset stores, clear mocks, setup test fixtures
  });

  // ─── Acceptance Criteria ───────────────────────────────
  describe('AC-1: {criterion description}', () => {
    it('should {expected behavior}', () => {
      // Arrange
      // Act
      // Assert
    });
  });

  describe('AC-2: {criterion description}', () => {
    it('should {expected behavior}', () => {
      // Arrange
      // Act
      // Assert
    });
  });

  // ─── Edge Cases ────────────────────────────────────────
  describe('edge cases', () => {
    it('E-1: should {expected behavior} when {scenario}', () => {
      // Arrange — set up the edge case condition
      // Act
      // Assert
    });

    it('E-2: should {expected behavior} when {scenario}', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Step 4 — Apply Test Type Patterns

#### Component Tests

```typescript
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// For dumb components: render with props, assert output
it('should display pokemon name and sprite', () => {
  const props = { name: 'Pikachu', spriteUrl: '/pikachu.png', onClick: vi.fn() };
  render(<PokemonListCard {...props} />);

  expect(screen.getByText('Pikachu')).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAttribute('src', '/pikachu.png');
});

// For smart components: mock hooks, render, assert integration
vi.mock('@pokemon/hooks/use-pokemon-list.hook', () => ({
  usePokemonList: vi.fn(),
}));

it('should render loading state while fetching', () => {
  vi.mocked(usePokemonList).mockReturnValue({
    items: [],
    status: PokemonListStatus.Loading,
    // ... rest of mock return
  });

  render(<PokemonListPage />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

// User interactions
it('should call onItemClick when a pokemon card is clicked', async () => {
  const user = userEvent.setup();
  const onItemClick = vi.fn();

  render(<PokemonList items={mockItems} onItemClick={onItemClick} />);
  await user.click(screen.getByText('Pikachu'));

  expect(onItemClick).toHaveBeenCalledWith(25); // Pikachu's ID
});
```

#### Hook Tests

```typescript
import { renderHook, act } from '@testing-library/react';

it('should return filtered items based on search query', () => {
  // Setup mock store with test data
  const { result } = renderHook(() => usePokemonList());

  act(() => {
    result.current.setSearchQuery('pika');
  });

  expect(result.current.items).toHaveLength(1);
  expect(result.current.items[0].name).toBe('pikachu');
});

// Memoization stability test
it('should maintain reference stability when unrelated state changes', () => {
  const { result, rerender } = renderHook(() => usePokemonList());
  const firstRef = result.current.items;

  rerender();
  expect(result.current.items).toBe(firstRef); // Same reference
});
```

#### Store Tests

```typescript
import { act } from '@testing-library/react';

it('should add a pokemon to the collection immutably', () => {
  const before = usePokedexStore.getState();
  const newPokemon = { id: 25, name: 'pikachu', imageUrl: '/pika.png', types: ['electric'] };

  act(() => {
    usePokedexStore.getState().catchPokemon(newPokemon);
  });

  const after = usePokedexStore.getState();
  expect(after.collection).toHaveLength(1);
  expect(after.collection[0].name).toBe('pikachu');
  expect(after.collection).not.toBe(before.collection); // Immutability
});

it('should not add duplicate pokemon', () => {
  const pokemon = { id: 25, name: 'pikachu', imageUrl: '/pika.png', types: ['electric'] };

  act(() => {
    usePokedexStore.getState().catchPokemon(pokemon);
    usePokedexStore.getState().catchPokemon(pokemon); // Duplicate
  });

  expect(usePokedexStore.getState().collection).toHaveLength(1);
});
```

### Step 5 — Create Test Data Factories

For specs with complex data contracts, generate a test data factory file:

```typescript
// tests/factories/{module}.factory.ts

import type { PokemonListItem } from '@pokemon/types/pokemon-list-item.types';

export function createMockPokemonListItem(
  overrides?: Partial<PokemonListItem>
): PokemonListItem {
  return {
    id: 25,
    name: 'pikachu',
    spriteUrl: 'https://raw.githubusercontent.com/.../25.png',
    ...overrides,
  };
}

export function createMockPokemonListItems(count: number): PokemonListItem[] {
  return Array.from({ length: count }, (_, i) =>
    createMockPokemonListItem({ id: i + 1, name: `pokemon-${i + 1}` })
  );
}
```

### Step 6 — Verify Red State

After generating all test files, run:

```bash
npm run test
```

**Every test MUST fail.** If any test passes, it means either:
- The test is not asserting correctly (false positive) — fix the assertion.
- Implementation code already exists — verify the test covers new behavior.

---

## Traceability Rules

- Every acceptance criterion (AC-N) in the spec MUST map to at least one test.
- Every edge case (E-N) in the spec MUST map to exactly one test.
- The test's `describe` or `it` label MUST reference the AC/E number.
- If a spec criterion is ambiguous, ask for clarification before writing the test.

---

## Checklist

- [ ] Every AC-N from the spec has at least one corresponding test.
- [ ] Every E-N from the spec has exactly one corresponding test.
- [ ] Test labels reference AC/E numbers for traceability.
- [ ] Component tests use `@testing-library/react` (no enzyme, no shallow rendering).
- [ ] User interactions use `userEvent` (not `fireEvent`).
- [ ] Hook tests use `renderHook` from `@testing-library/react`.
- [ ] Store tests access state via `getState()` and wrap mutations in `act()`.
- [ ] All external dependencies are mocked.
- [ ] Test data factories created for complex data shapes.
- [ ] All tests fail in red phase (verified by running test suite).
- [ ] No `any` type in test files.
