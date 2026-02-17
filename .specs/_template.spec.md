# Spec: [Feature Name]

## Module

> `pokemon` | `pokedex` | `shared`

## Summary

> One to two sentences describing the feature and its purpose within the application.

---

## Acceptance Criteria

> Each criterion is a testable statement. Use "MUST", "MUST NOT", "SHOULD" language.

- [ ] AC-1: ...
- [ ] AC-2: ...
- [ ] AC-3: ...

---

## Data Contracts

### Types

```typescript
// Define or reference all types consumed and produced by this feature.
```

### Enums

```typescript
// Define or reference all enums used by this feature.
```

### Store Shape

```typescript
// Define the Zustand store slice relevant to this feature.
// Include state fields, actions, and selectors.
```

### API Response Shape

> Only applicable to the `pokemon` module. The `pokedex` module has no API calls.

```typescript
// Define or reference the PokéAPI response types consumed by this feature.
```

---

## Component Tree

> Describe the component hierarchy. Mark each component as **smart** (accesses hooks/store/API) or **dumb** (props only).

```
FeatureRoot (smart)
├── ChildComponentA (dumb)
│   └── GrandchildComponent (dumb)
└── ChildComponentB (smart)
```

### Component Interfaces

```typescript
// Props interface for each dumb component.
// Hook return type for each smart component's data source.
```

---

## Hook API

```typescript
// Define the public API of the feature's primary hook.
// Include parameters, return type, and description of each field.
```

---

## Edge Cases & Error Scenarios

> List every boundary condition, failure mode, and degenerate input the implementation must handle.

| # | Scenario | Expected Behavior |
|---|---|---|
| E-1 | ... | ... |
| E-2 | ... | ... |

---

## Out of Scope

> Explicitly list what this feature does NOT include to prevent scope creep.

- ...
- ...
