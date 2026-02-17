# Spec: Pokédex Collection

## Module

`pokedex`

## Summary

The collection system that allows users to "catch" Pokémon and maintain a personal Pokédex. Caught Pokémon are stored in a Zustand store synced to Local Storage, persisting across browser sessions and synchronizing across tabs. The module provides both the catch action (consumed by the `pokemon` module's detail view via its catch slot) and a dedicated collection view displaying all caught Pokémon.

This module MUST NOT make any direct API calls to the PokéAPI. All Pokémon data entering this module comes from the `pokemon` module at catch time.

---

## Acceptance Criteria

### Catch Mechanic

- [ ] AC-1: The user MUST be able to catch a Pokémon from the Pokémon Detail View via the catch slot integration point.
- [ ] AC-2: When a Pokémon is caught, its data (id, name, imageUrl, types) MUST be saved to the Pokédex Zustand store.
- [ ] AC-3: The store MUST immediately persist the updated collection to Local Storage.
- [ ] AC-4: If a Pokémon is already in the collection, the catch action MUST NOT create a duplicate. The UI SHOULD indicate that the Pokémon is already caught.
- [ ] AC-5: The user MUST be able to release (remove) a caught Pokémon from their collection.
- [ ] AC-6: Releasing a Pokémon MUST remove it from the store and update Local Storage immediately.

### Collection View

- [ ] AC-7: A dedicated collection view MUST display all caught Pokémon.
- [ ] AC-8: Each entry in the collection MUST display the Pokémon's picture, name, and type(s).
- [ ] AC-9: If the collection is empty, the view MUST display an empty state message encouraging the user to catch Pokémon.
- [ ] AC-10: The collection view MUST be accessible from the main navigation of the application.

### Persistence & Sync

- [ ] AC-11: The caught Pokémon collection MUST persist across browser sessions (survive browser close and reopen).
- [ ] AC-12: On app load, the collection MUST be hydrated from Local Storage into the Zustand store.
- [ ] AC-13: Changes to the collection in one tab MUST be reflected in all other open tabs via the `storage` event listener.
- [ ] AC-14: If Local Storage is unavailable or throws an error, the app MUST continue functioning with in-memory state only. A non-blocking warning SHOULD be shown to the user.

### Catch Status Integration

- [ ] AC-15: The `usePokedex` hook MUST expose a method to check whether a given Pokémon (by ID) is already caught.
- [ ] AC-16: The Pokémon Detail View's catch slot MUST use this check to toggle between "Catch" and "Already Caught" / "Release" states.

---

## Data Contracts

### Types

```typescript
/** A Pokémon entry as stored in the collection.
 *  This is a snapshot of data captured at catch time.
 *  It does NOT update if the source API data changes. */
interface CaughtPokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  caughtAt: string; // ISO 8601 timestamp of when the Pokémon was caught
}

/** Serializable collection structure stored in Local Storage. */
interface PokedexCollection {
  version: number; // Schema version for future migration support
  pokemon: CaughtPokemon[];
}
```

### Enums

```typescript
enum CatchStatus {
  Uncaught = "Uncaught",
  Caught = "Caught",
}
```

### Store Shape

```typescript
interface PokedexStore {
  // State
  collection: CaughtPokemon[];
  hydrated: boolean; // Whether Local Storage hydration has completed

  // Actions
  catchPokemon: (pokemon: Omit<CaughtPokemon, 'caughtAt'>) => void;
  releasePokemon: (pokemonId: number) => void;
  setCollection: (collection: CaughtPokemon[]) => void;
  setHydrated: (hydrated: boolean) => void;

  // Selectors
  isCaught: (pokemonId: number) => boolean;
  getCatchStatus: (pokemonId: number) => CatchStatus;
  collectionCount: () => number;
}
```

### API Response Shape

> Not applicable. The `pokedex` module makes no API calls. All data enters through the `catchPokemon` action, which receives pre-resolved `PokemonDetailDisplay` data from the `pokemon` module.

---

## Component Tree

### Collection View

```
PokedexCollectionPage (smart)
├── PokedexCollectionHeader (dumb) — title + count
├── PokedexCollectionList (dumb)
│   └── PokedexCollectionCard (dumb) — repeated per caught Pokémon
└── PokedexEmptyState (dumb) — shown when collection is empty
```

### Catch Slot (rendered inside PokemonDetailPage)

```
PokemonDetailCatchSlot (smart) — uses usePokedex
└── CatchButton (dumb) — toggles between catch/release states
```

### Component Interfaces

```typescript
interface PokedexCollectionHeaderProps {
  count: number;
}

interface PokedexCollectionListProps {
  pokemon: CaughtPokemon[];
  onRelease: (pokemonId: number) => void;
}

interface PokedexCollectionCardProps {
  pokemon: CaughtPokemon;
  onRelease: () => void;
}

interface CatchButtonProps {
  status: CatchStatus;
  onCatch: () => void;
  onRelease: () => void;
}
```

---

## Hook API

```typescript
interface UsePokedexReturn {
  /** All caught Pokémon in the collection. */
  collection: CaughtPokemon[];
  /** Number of caught Pokémon. */
  count: number;
  /** Whether Local Storage hydration is complete. */
  hydrated: boolean;
  /** Catch a Pokémon and add it to the collection. No-op if already caught. */
  catchPokemon: (pokemon: Omit<CaughtPokemon, 'caughtAt'>) => void;
  /** Release a Pokémon from the collection by ID. */
  releasePokemon: (pokemonId: number) => void;
  /** Check if a Pokémon is already in the collection. */
  isCaught: (pokemonId: number) => boolean;
  /** Get the catch status enum for a Pokémon. */
  getCatchStatus: (pokemonId: number) => CatchStatus;
}

function usePokedex(): UsePokedexReturn;
```

---

## Edge Cases & Error Scenarios

| # | Scenario | Expected Behavior |
|---|---|---|
| E-1 | User catches a Pokémon that is already in the collection | No duplicate is created. UI reflects "Already Caught" state. |
| E-2 | User releases a Pokémon that is not in the collection | No-op. No error thrown. |
| E-3 | Collection is empty | Collection view shows empty state message. Count displays 0. |
| E-4 | Local Storage is full (quota exceeded) on catch | Catch succeeds in-memory. Persistence fails gracefully with a user-visible warning. Collection is not lost. |
| E-5 | Local Storage is unavailable (e.g., private browsing mode in some browsers) | App functions with in-memory state only. Warn user that collection will not persist. |
| E-6 | Local Storage contains corrupted or malformed data on hydration | Discard corrupted data, initialize with empty collection. Log warning. Do not crash. |
| E-7 | Local Storage contains data from an older schema version | The `version` field enables future migration logic. For v1, no migration is needed — just load. |
| E-8 | Another tab catches or releases a Pokémon | The `storage` event fires. This tab's Zustand store updates to reflect the change. UI re-renders. |
| E-9 | Two tabs simultaneously catch different Pokémon | Last-write-wins in Local Storage. Both catches should be present because each tab reads the current state before writing. Use functional state updates to merge. |
| E-10 | User navigates to the collection view before hydration completes | Show a brief loading state until `hydrated` is `true`. |
| E-11 | User catches a Pokémon whose imageUrl later becomes a broken link | The collection stores a snapshot at catch time. Broken images display a placeholder. This is acceptable since the collection does not re-fetch data. |

---

## Out of Scope

- Sorting or filtering the collection (by name, type, catch date, etc.).
- Nicknames, notes, or custom metadata for caught Pokémon.
- Collection limits or caps.
- Undo/redo for catch and release actions.
- Exporting or importing collections.
- Any direct API calls to PokéAPI from this module.
- Animation or visual effects for the catch/release actions.
- Collection statistics beyond the total count.
