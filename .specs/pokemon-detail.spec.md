# Spec: Pokémon Detail View

## Module

`pokemon`

## Summary

A dedicated view displaying comprehensive information for a single Pokémon. Users navigate here by clicking a Pokémon entry in the list view. The detail view shows the Pokémon's name, a larger image, and all applicable types. It also exposes a "Catch" action point that the `pokedex` module integrates into.

---

## Acceptance Criteria

- [ ] AC-1: The detail view MUST be accessible via a route parameterized by Pokémon ID or name (e.g., `/pokemon/:idOrName`).
- [ ] AC-2: On mount, the view MUST fetch the Pokémon's full data from `GET /pokemon/{id or name}` via TanStack Query + HeyAPI.
- [ ] AC-3: The view MUST display the Pokémon's name.
- [ ] AC-4: The view MUST display a larger image of the Pokémon. Use `sprites.other['official-artwork'].front_default` as the primary source. Fall back to `sprites.front_default` if official artwork is unavailable.
- [ ] AC-5: The view MUST display all of the Pokémon's types, rendered from the `types` array (`types[].type.name`).
- [ ] AC-6: The view MUST provide a navigation mechanism to return to the list view.
- [ ] AC-7: While data is loading, the view MUST display a loading indicator.
- [ ] AC-8: If the API request fails, the view MUST display an error state with a retry option.
- [ ] AC-9: If the Pokémon ID/name in the route does not correspond to a valid Pokémon (404 from API), the view MUST display a "not found" state.
- [ ] AC-10: Fetched detail data MUST be cached by TanStack Query and the Zustand store to avoid redundant requests on re-navigation.
- [ ] AC-11: The view MUST expose a slot or callback for the "Catch" action. The catch logic itself is owned by the `pokedex` module — this view only provides the integration point.

---

## Data Contracts

### Types

```typescript
/** Pokémon type entry from the API response. */
interface PokemonTypeEntry {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

/** Pokémon sprite data (subset relevant to the detail view). */
interface PokemonSprites {
  front_default: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
  };
}

/** Full Pokémon detail as consumed by the detail view. */
interface PokemonDetail {
  id: number;
  name: string;
  sprites: PokemonSprites;
  types: PokemonTypeEntry[];
}

/** Resolved display data after processing API response. */
interface PokemonDetailDisplay {
  id: number;
  name: string;
  imageUrl: string; // Resolved from sprites hierarchy with fallback
  types: string[];  // Extracted type names, e.g. ["grass", "poison"]
}
```

### Enums

```typescript
enum PokemonDetailStatus {
  Idle = "Idle",
  Loading = "Loading",
  Success = "Success",
  Error = "Error",
  NotFound = "NotFound",
}
```

### Store Shape

```typescript
interface PokemonDetailStore {
  // State
  currentDetail: PokemonDetailDisplay | null;
  status: PokemonDetailStatus;

  // Actions
  setCurrentDetail: (detail: PokemonDetailDisplay | null) => void;
  setStatus: (status: PokemonDetailStatus) => void;
  clearCurrentDetail: () => void;
}
```

### API Response Shape

The full `GET /pokemon/{id}` response is typed by the HeyAPI-generated client. The `PokemonDetail` type above represents the subset of fields consumed by this feature. The generated types from HeyAPI are the source of truth at build time.

---

## Component Tree

```
PokemonDetailPage (smart)
├── PokemonDetailHeader (dumb) — name + back navigation
├── PokemonDetailImage (dumb) — larger image with fallback
├── PokemonDetailTypes (dumb) — type badges/chips
├── PokemonDetailCatchSlot (smart) — integration point for pokedex module
└── PokemonDetailStatusIndicator (dumb) — loading / error / not found states
```

### Component Interfaces

```typescript
interface PokemonDetailHeaderProps {
  name: string;
  onBack: () => void;
}

interface PokemonDetailImageProps {
  imageUrl: string;
  altText: string;
}

interface PokemonDetailTypesProps {
  types: string[];
}

/** This component is smart — it uses usePokedex internally.
 *  It receives the Pokemon data needed to perform the catch action. */
interface PokemonDetailCatchSlotProps {
  pokemon: PokemonDetailDisplay;
}

interface PokemonDetailStatusIndicatorProps {
  status: PokemonDetailStatus;
  onRetry: () => void;
}
```

---

## Hook API

```typescript
interface UsePokemonDetailReturn {
  /** Resolved display data for the current Pokémon. Null while loading or on error. */
  detail: PokemonDetailDisplay | null;
  /** Current loading/error/not-found status. */
  status: PokemonDetailStatus;
  /** Retry the last failed request. */
  retry: () => void;
}

/**
 * @param idOrName — Pokémon ID (number) or name (string) from the route parameter.
 */
function usePokemonDetail(idOrName: string | number): UsePokemonDetailReturn;
```

---

## Edge Cases & Error Scenarios

| # | Scenario | Expected Behavior |
|---|---|---|
| E-1 | Route parameter is a valid Pokémon name (string) | Fetch by name succeeds. Display the Pokémon. |
| E-2 | Route parameter is a valid Pokémon ID (numeric string) | Parse to number, fetch by ID. Display the Pokémon. |
| E-3 | Route parameter does not match any Pokémon (API returns 404) | Display "not found" state with a link back to the list view. |
| E-4 | Route parameter is empty, non-alphanumeric, or malformed | Display "not found" state. Do not send malformed requests to the API. |
| E-5 | API request fails (network error, 500) | Display error state with retry button. |
| E-6 | `sprites.other['official-artwork'].front_default` is `null` or missing | Fall back to `sprites.front_default`. |
| E-7 | Both `official-artwork` and `front_default` sprites are `null` | Display a placeholder image. |
| E-8 | Pokémon has a single type | Render one type badge. No layout issues. |
| E-9 | Pokémon has two types | Render both type badges. |
| E-10 | User navigates directly to a detail URL (deep link) | View fetches data independently without depending on list view state. |
| E-11 | User rapidly navigates between different Pokémon details | Previous in-flight requests MUST be cancelled or their results ignored (stale closure prevention). Only the most recent navigation's data is displayed. |

---

## Out of Scope

- Displaying stats, abilities, moves, evolution chains, or any data beyond name, image, and types.
- Previous/next Pokémon navigation within the detail view.
- Animated sprites or sprite galleries.
- The catch logic itself — this spec only defines the integration slot. The catch mechanic is specified in `pokedex-collection.spec.md`.
- Sharing or deep-link metadata (Open Graph tags, etc.).
