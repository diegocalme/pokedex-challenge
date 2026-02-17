# Skill: Create Component

## Purpose

Scaffold a React component following the project's dumb/smart classification, file naming conventions, memoization standards, and folder structure. When a `.pen` design file exists for the component, use the Pencil MCP server to read exact visual specs and generate markup that matches the design precisely.

---

## Inputs

| Input | Required | Description |
|---|---|---|
| `componentName` | Yes | PascalCase component name (e.g., `PokemonListCard`) |
| `module` | Yes | Target module: `pokemon`, `pokedex`, or `shared` |
| `classification` | Yes | `dumb` (presentational) or `smart` (container) |
| `propsInterface` | If dumb | TypeScript interface for the component's props |
| `hookDependencies` | If smart | Hooks the component consumes (e.g., `usePokemon`, `usePokedex`) |
| `penFile` | No | Path to a `.pen` design file for visual reference |

---

## Procedure

### Step 1 — Resolve Design Specs (if `.pen` file provided)

If a `penFile` is provided, use the Pencil MCP server to inspect the design:

1. Read the `.pen` file via MCP to extract the component's visual structure.
2. Extract exact values: padding, margin, spacing, font sizes, font weights, line heights, border radius, colors.
3. Identify the layout model (flex direction, alignment, gap, wrapping).
4. Note any design variables or tokens defined in the `.pen` file.
5. Map extracted values to Tailwind CSS utility classes or CSS module properties.

> **Prompt pattern for Pencil MCP:**
> "Inspect the frame named `[componentName]` in `[penFile]`. Extract all spacing, typography, color, and layout values. List them as a structured table."

If no `.pen` file is provided, generate the component with semantic HTML structure and placeholder styling. A `.pen` file can be created later, and the component updated to match via the `/refactor` command.

### Step 2 — Determine File Paths

Convert `componentName` from PascalCase to kebab-case for file naming.

```
src/{module}/components/{component_folder}/
├── {kebab-name}.component.tsx       # Component implementation
└── {kebab-name}.component.test.tsx  # Component tests
```

**Examples:**
- `PokemonListCard` in `pokemon` module →
  - `src/pokemon/components/pokemon_list_card/pokemon-list-card.component.tsx`
  - `src/pokemon/components/pokemon_list_card/pokemon-list-card.component.test.tsx`

### Step 3 — Generate Component File

#### Dumb (Presentational) Component Template

```typescript
import { memo } from 'react';
import type { {PropsInterface} } from './{types-import-path}';

interface {ComponentName}Props {
  // Define or import props interface
}

function {ComponentName}Base({ ...props }: {ComponentName}Props): React.JSX.Element {
  return (
    // JSX — if .pen file was read, match design specs exactly
  );
}

// Apply React.memo for presentational components.
// Remove if it causes animation/UI state glitches and document why.
export const {ComponentName} = memo({ComponentName}Base);
```

**Rules for dumb components:**
- Receive ALL data via props. No hooks, no store access, no API calls.
- Wrap with `React.memo()`.
- Use `useMemo` for any computed values derived from props.
- Use `useCallback` for any event handler functions that will be passed further down.
- No side effects.

#### Smart (Container) Component Template

```typescript
import { useMemo, useCallback } from 'react';
import { {hook} } from '@{module}/hooks/{hook-file}';

export function {ComponentName}(): React.JSX.Element {
  const { ...data } = {hook}();

  // Memoize derived values
  const derivedValue = useMemo(() => {
    // computation
  }, [dependency]);

  // Memoize callbacks
  const handleAction = useCallback(() => {
    // handler logic
  }, [dependency]);

  return (
    // Compose dumb components, passing data via props
  );
}
```

**Rules for smart components:**
- Access business logic and state ONLY through hooks (`usePokemon`, `usePokedex`).
- Do NOT apply `React.memo()` — smart components typically have unique state.
- Memoize all computed values with `useMemo`.
- Memoize all callbacks with `useCallback`.
- Compose presentational components, never render complex UI directly.

### Step 4 — Generate Test File

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { {ComponentName} } from './{kebab-name}.component';

describe('{ComponentName}', () => {
  // For dumb components: test rendering with props
  // For smart components: mock hooks, test integration

  it('should render without crashing', () => {
    // arrange, act, assert
  });

  // Additional tests per acceptance criteria
});
```

### Step 5 — Pencil Design Sync Verification (if `.pen` file was used)

After generating the component, prompt the developer to visually verify:

1. Run the dev server and render the component.
2. Compare rendered output against the `.pen` file side-by-side.
3. If drift is detected, use the Pencil MCP to re-read exact values and adjust.

> **Prompt pattern for verification:**
> "Compare the rendered output of `{ComponentName}` with the frame `[frameName]` in `[penFile]`. Identify any spacing, color, or typography mismatches."

---

## Checklist

- [ ] File name follows `kebab-case.component.tsx` convention.
- [ ] Folder name follows `snake_case` convention.
- [ ] Dumb component wrapped with `React.memo()`.
- [ ] Smart component accesses state only through hooks.
- [ ] All computed values use `useMemo`.
- [ ] All callbacks use `useCallback`.
- [ ] `any` type not used anywhere.
- [ ] Props interface defined for dumb components.
- [ ] Test file co-located with component.
- [ ] Design values match `.pen` file (if applicable).
