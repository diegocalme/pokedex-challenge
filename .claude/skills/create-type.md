# Skill: Create Type

## Purpose

Scaffold TypeScript type definitions and enums following the project's composition-first approach. Types use built-in TS operators to derive variations rather than redeclaring similar shapes. Enums are preferred over string literal types for all fixed value sets.

---

## Inputs

| Input | Required | Description |
|---|---|---|
| `typeName` | Yes | PascalCase type name (e.g., `PokemonListItem`, `CaughtPokemon`) |
| `module` | Yes | Target module: `pokemon`, `pokedex`, or `shared` |
| `kind` | Yes | `type`, `interface`, or `enum` |
| `fields` | If type/interface | Field definitions with types and descriptions |
| `members` | If enum | Enum member names and values |
| `derivedFrom` | No | Base type to compose from using TS operators |

---

## Procedure

### Step 1 — Determine File Path and Separation

**Enum files:**
```
src/{module}/enums/{kebab-name}.enums.ts
```

**Type/interface files:**
```
src/{module}/types/{kebab-name}.types.ts
```

**Shared types** accessed by multiple modules go in:
```
src/shared/types/{kebab-name}.types.ts
```

**Decision: when to separate vs. co-locate**
- If the type/enum is used by a single file → co-locate in the same file.
- If the type/enum is used by 2+ files within the same module → extract to the module's `types/` or `enums/` directory.
- If the type/enum is used across modules → extract to `shared/types/` or `shared/enums/`.

### Step 2 — Generate Type/Interface

#### Standard Interface

```typescript
/** JSDoc description of the type's purpose and domain context. */
export interface {TypeName} {
  /** Field description. */
  fieldName: FieldType;
}
```

#### Composed Type (derived from a base)

Prefer composition over redefinition. Use built-in TS operators:

```typescript
import type { BaseType } from './{base-type-file}';

/** Derived from BaseType — {describe what's different and why}. */
export type {TypeName} = Omit<BaseType, 'removedField'> & {
  /** Additional field description. */
  newField: NewFieldType;
};
```

**Common composition patterns:**

```typescript
// Subset of fields
type Summary = Pick<Full, 'id' | 'name'>;

// All fields optional
type Patch = Partial<Full>;

// Remove fields
type WithoutMeta = Omit<Full, 'createdAt' | 'updatedAt'>;

// Map to a value type
type StatusMap = Record<StatusEnum, boolean>;

// Required fields from a partial
type RequiredFields = Required<Pick<Config, 'apiKey' | 'baseUrl'>>;

// Combine
type CreatePayload = Omit<Entity, 'id' | 'createdAt'> & {
  tempId?: string;
};
```

**Rules:**
- Never redeclare a type that can be derived from an existing one.
- Always use `import type` for type-only imports.
- Every field must have a JSDoc comment.
- Use `readonly` for fields that should never be reassigned after creation.

### Step 3 — Generate Enum

```typescript
/** JSDoc description of what this enum represents. */
export enum {EnumName} {
  /** Member description. */
  MemberOne = "MemberOne",
  /** Member description. */
  MemberTwo = "MemberTwo",
}
```

**Rules:**
- PascalCase for enum name and members.
- Always use string values matching the member name. This ensures serialization/deserialization consistency (JSON, Local Storage, URL params).
- Never use numeric enums — string enums are self-documenting and debuggable.
- Prefer enums over string literal union types (`type Status = 'loading' | 'error'`). Enums are refactorable, discoverable, and enforceable.
- Every member must have a JSDoc comment.

### Step 4 — Verify No `any`

Scan the generated file for `any`. If found, replace with an explicit type or `unknown`. This step is non-negotiable.

---

## Composition Decision Tree

When creating a new type, follow this decision tree:

```
Does a similar type already exist?
├── Yes → Can the new type be derived using Pick/Omit/Partial/etc.?
│   ├── Yes → Compose from the existing type.
│   └── No → Are they conceptually the same domain entity?
│       ├── Yes → Refactor the base type to support both use cases.
│       └── No → Create a new independent type.
└── No → Create a new independent type.
```

---

## Checklist

- [ ] File name follows `{name}.types.ts` or `{name}.enums.ts` convention.
- [ ] Types composed from existing types where possible.
- [ ] `import type` used for all type-only imports.
- [ ] Every field and enum member has a JSDoc comment.
- [ ] String values used for enum members (not numeric).
- [ ] Enums used instead of string literal union types.
- [ ] No `any` anywhere.
- [ ] Placement: same-file if single use, module `types/`/`enums/` if multi-file, `shared/` if cross-module.
