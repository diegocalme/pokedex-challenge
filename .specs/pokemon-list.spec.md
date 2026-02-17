# Spec: Pokémon List View

## Module

`pokemon`

## Summary

The main landing view of the application. Displays a paginated, searchable list of Pokémon fetched from the PokéAPI. Each entry shows the Pokémon's name and sprite. Users can filter the list by name and click any entry to navigate to the detail view.

---

## Acceptance Criteria

- [ ] AC-1: The list view MUST fetch Pokémon data from `GET /pokemon` via TanStack Query + HeyAPI on initial load.
- [ ] AC-2: Each list entry MUST display the Pokémon's name and front default sprite (`sprites.front_default`).
- [ ] AC-3: The list MUST support infinite scroll to navigate through the full Pokémon catalog. When the user scrolls to the bottom, the next batch of Pokémon MUST be fetched automatically using the PokéAPI's `offset` and `limit` query parameters. Previously loaded items MUST remain visible during loading.
- [ ] AC-4: The view MUST include a search input that filters displayed Pokémon by name.
- [ ] AC-5: Search filtering MUST be performed client-side against already-fetched data for instant feedback.
- [ ] AC-6: Search MUST be case-insensitive.
- [ ] AC-7: When the search input is cleared, the full unfiltered list MUST be restored.
- [ ] AC-8: Clicking a Pokémon entry MUST navigate to the Pokémon Detail View for that Pokémon.
- [ ] AC-9: While data is loading, the view MUST display a loading indicator.
- [ ] AC-10: If the API request fails, the view MUST display an error state with a retry option.
- [ ] AC-11: Fetched Pokémon data MUST be cached in the Zustand store and persisted to Local Storage.
- [ ] AC-12: On subsequent visits, the view MUST hydrate from Local Storage and display cached data immediately while background-fetching fresh data.

---

## Data Contracts

### Types

```typescript
/** Minimal Pokémon entry as returned by GET /pokemon (list endpoint). */
interface PokemonListEntry {
  name: string;
  url: string; // Resource URL, e.g. "https://pokeapi.co/api/v2/pokemon/1/"
}

/** Enriched list item after fetching sprite data. */
interface PokemonListItem {
  id: number;
  name: string;
  spriteUrl: string; // sprites.front_default
}

/** Paginated API response shape from GET /pokemon. */
interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListEntry[];
}
```

### Enums

```typescript
enum PokemonListStatus {
  Idle = "Idle",
  Loading = "Loading",
  LoadingMore = "LoadingMore",
  Success = "Success",
  Error = "Error",
}
```

### Store Shape

```typescript
interface PokemonListStore {
  // State
  items: PokemonListItem[];
  status: PokemonListStatus;
  searchQuery: string;
  currentOffset: number;
  totalCount: number;

  // Actions
  setItems: (items: PokemonListItem[]) => void;
  appendItems: (items: PokemonListItem[]) => void;
  setStatus: (status: PokemonListStatus) => void;
  setSearchQuery: (query: string) => void;
  setCurrentOffset: (offset: number) => void;
  setTotalCount: (count: number) => void;

  // Selectors (derived)
  filteredItems: () => PokemonListItem[]; // items filtered by searchQuery
}
```

### API Response Shape

Responses are typed by the HeyAPI-generated client from the PokéAPI OpenAPI spec. The types above (`PokemonListResponse`, `PokemonListEntry`) mirror the expected shape for reference. The generated types from HeyAPI are the source of truth at build time.

---

## Component Tree

```
PokemonListPage (smart)
├── PokemonSearchBar (dumb)
├── PokemonList (dumb)
│   └── PokemonListCard (dumb) — repeated per item
├── Sentinel div (IntersectionObserver triggers fetchNextPage)
└── PokemonListStatusIndicator (dumb) — loading / loading-more / error states
```

### Component Interfaces

```typescript
interface PokemonSearchBarProps {
  value: string;
  onChange: (query: string) => void;
}

interface PokemonListProps {
  items: PokemonListItem[];
  onItemClick: (pokemonId: number) => void;
}

interface PokemonListCardProps {
  pokemon: PokemonListItem;
  onClick: () => void;
}

interface PokemonListStatusIndicatorProps {
  status: PokemonListStatus;
  isFetchingNextPage: boolean;
  onRetry: () => void;
}
```

---

## Hook API

```typescript
interface UsePokemonListReturn {
  /** Filtered list of Pokémon based on current search query. */
  items: PokemonListItem[];
  /** Current loading/error status. */
  status: PokemonListStatus;
  /** Current search query string. */
  searchQuery: string;
  /** Whether more pages are available. */
  hasNextPage: boolean;
  /** Whether a next-page fetch is in progress. */
  isFetchingNextPage: boolean;
  /** Update the search filter. */
  setSearchQuery: (query: string) => void;
  /** Fetch the next page of results (triggered by infinite scroll sentinel). */
  fetchNextPage: () => void;
  /** Retry the last failed request. */
  retry: () => void;
}

function usePokemonList(): UsePokemonListReturn;
```

---

## Edge Cases & Error Scenarios

| # | Scenario | Expected Behavior |
|---|---|---|
| E-1 | Search query matches zero Pokémon | Display an empty state message ("No Pokémon found"). Do not show an error. |
| E-2 | Search query contains special characters | Treat as literal string; do not crash or throw. |
| E-3 | API returns an empty results array | Display empty state. Pagination controls show no next/previous. |
| E-4 | API request times out or fails (network error) | Display error state with retry button. Cached data (if any) remains accessible. |
| E-5 | API returns a Pokémon with `sprites.front_default` as `null` | Display a placeholder image instead. |
| E-6 | Local Storage is unavailable (private browsing, quota exceeded) | App continues to function with in-memory state only. Log warning, do not crash. |
| E-7 | User navigates back from detail view | List view restores previous search query and scroll position from store state. |
| E-8 | Multiple tabs open simultaneously | All tabs reflect the same cached data via Local Storage sync. |
| E-9 | Very rapid search input (debounce) | Filter updates SHOULD be debounced (~300ms) to avoid excessive re-renders. |
| E-10 | Reaching end of catalog | No loading indicator shown when `hasNextPage` is false. Sentinel stops triggering. |
| E-11 | Rapid scrolling | Duplicate fetches MUST NOT be triggered. `isFetchingNextPage` guard prevents concurrent page loads. |

---

## Out of Scope

- Sorting Pokémon by any criteria other than the default API order.
- Filtering by type, generation, or any attribute other than name.
- ~~Infinite scroll~~ — Implemented. Replaced explicit pagination controls.
- Server-side search via the PokéAPI (client-side filtering only).
- Pokémon detail data prefetching on hover.
- Any "catch" functionality — that belongs to the `pokedex` module.
