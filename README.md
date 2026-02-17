# Pokédex App

## Project Overview

A React-based web application that allows users to browse, search, and explore Pokémon using data from the [PokéAPI](https://pokeapi.co/docs/v2). Users can view detailed information about each Pokémon and build a personal collection by "catching" Pokémon, with their collection persisted across browser sessions via Local Storage.

This project follows a modular, domain-driven architecture with clearly separated concerns for Pokémon data retrieval, state management, browser persistence, and collection management.

---

## Product Requirements

### 1. Main Pokémon List View

- **Search & Filter:** Users can search and filter Pokémon by name efficiently.
- **List Display:** Each Pokémon entry in the list must show:
  - Name
  - Picture (using sprites from the PokéAPI)

### 2. Pokémon Detail View

- **Navigation:** Clicking any Pokémon in the list navigates to a dedicated detail view.
- **Detail Information:** The detail view must display:
  - Name
  - Larger picture/image
  - All applicable type(s)

### 3. Caught Pokémon Collection (Pokédex)

- **Catch Mechanic:** Users can "catch" a Pokémon and save it to a personal collection.
- **Collection View:** A dedicated view displays the user's caught Pokémon, each showing:
  - Picture
  - Name
  - Type(s)

### 4. Data Management & Persistence

- **Storage:** The user's Pokémon collection is managed using `localStorage` (chosen over `sessionStorage` to maintain data across browser sessions).
- **Rationale:** Local Storage was selected to ensure the caught Pokémon collection persists when the user closes and reopens the browser, aligning with the product goal of a personal, long-lived collection.

---

## Architecture

### Module Structure

The application is organized into two primary domain modules and a shared utilities layer:

```
src/
├── pokemon/          # Raw Pokémon data module
│   ├── api/          # TanStack Query + HeyAPI integration with PokéAPI
│   ├── store/        # Zustand store for Pokémon state
│   ├── persistence/  # Local Storage sync layer
│   ├── hooks/        # usePokemon hook (unified access to all contexts)
│   ├── components/   # UI components (list, detail, search)
│   ├── types/        # Pokémon-specific types
│   └── enums/        # Pokémon-specific enums
├── pokedex/          # Collection ("caught") module
│   ├── store/        # Zustand store for collection state
│   ├── persistence/  # Local Storage sync layer
│   ├── hooks/        # usePokedex hook (unified access to contexts)
│   ├── components/   # Collection UI components
│   ├── types/        # Pokédex-specific types
│   └── enums/        # Pokédex-specific enums
└── shared/           # Cross-cutting concerns
    ├── types/        # Shared type definitions
    ├── utils/        # Utility functions
    └── components/   # Shared UI components
```

### Key Architectural Decisions

#### API Layer: TanStack Query + HeyAPI

- **TanStack Query** handles API query management, providing retry strategies, caching, and reactive data fetching out of the box.
- **HeyAPI** is used instead of raw Fetch or Axios because the PokéAPI publishes an [OpenAPI spec](https://github.com/PokeAPI/pokeapi/blob/master/openapi.yml). HeyAPI generates fully typed API clients from this spec, eliminating manual type definitions for API responses.
- **GraphQL was intentionally avoided** because the PokéAPI GraphQL endpoint is in beta.

#### State Management: Zustand

- **Zustand** was chosen over React Context for global state management due to the complexity introduced by multi-source data hydration (API + Local Storage + in-memory state).
- Zustand provides a lightweight abstraction that simplifies state and persistence management while avoiding the boilerplate and re-render concerns of React Context.
- State must be **reactive and immutable**.

#### Data Source Hierarchy

The application reconciles data from three sources with a clear priority order:

1. **In-memory app state** — the source of truth at runtime.
2. **External API (PokéAPI)** — patches in-memory state with fresh data.
3. **Local Storage** — patches in-memory state during hydration (initial load) and syncs bidirectionally during the session.

#### Persistence Challenges

- **Cross-tab synchronization:** All app instances (tabs/windows) must stay in sync with Local Storage reactively.
- **State conflict avoidance:** The hydration process must prevent conflicts between stale persisted data and fresh API data.
- **Initial hydration:** On app load, persisted state from Local Storage is loaded into in-memory state before API data patches it.

#### Module Separation

- The **Pokémon module** handles raw Pokémon data retrieval, caching, and display. It does not manage collections.
- The **Pokédex module** handles the "catch" mechanic and collection management. Its data sources are only the persistence layer and in-memory state (no direct API calls for collection data).
- This separation follows Domain-Driven Design principles, keeping each module focused on a single bounded context.

### Technology Stack

| Concern | Technology | Rationale |
|---|---|---|
| Framework | React | Core UI framework |
| Build Tool | Vite | Fast compilation and HMR |
| State Management | Zustand | Lightweight, handles persistence complexity |
| API Querying | TanStack Query | Caching, retries, reactive fetching |
| API Client | HeyAPI | Type-safe client from OpenAPI spec |
| Persistence | Local Storage | Cross-session data retention |
| Language | TypeScript (strict) | Full type safety, no `any` allowed |

---

## Data Source: PokéAPI

- **Base URL:** `https://pokeapi.co/api/v2/`
- **OpenAPI Spec:** [GitHub — openapi.yml](https://github.com/PokeAPI/pokeapi/blob/master/openapi.yml)
- **Key Endpoints:**
  - `GET /pokemon` — paginated list of Pokémon (name + URL).
  - `GET /pokemon/{id or name}` — full Pokémon details (name, sprites, types, stats, abilities).
- **Sprites:** Available via the `sprites` field on each Pokémon resource. Use `sprites.front_default` for list thumbnails and a larger sprite variant for the detail view.
- **Types:** Available via the `types` array on each Pokémon resource, each containing `type.name`.

---

## User Flows

### Browse & Search

1. User lands on the main list view showing paginated Pokémon with name and sprite.
2. User types in the search bar to filter Pokémon by name.
3. Filtered results update reactively.

### View Details

1. User clicks a Pokémon in the list.
2. App navigates to the detail view.
3. Detail view displays the Pokémon's name, a larger image, and all types.

### Catch & Collect

1. From any view showing a Pokémon, user clicks "Catch" to add it to their collection.
2. The Pokémon is saved to the Pokédex (Zustand store + Local Storage).
3. User navigates to the collection view to see all caught Pokémon with picture, name, and types.
4. Collection persists across browser sessions and syncs across tabs.

---

## Error Handling Strategy

- **Error boundaries** wrap providers to gracefully handle business logic failures, injection errors, and unexpected runtime exceptions.
- **API errors** are handled by TanStack Query's built-in error/retry mechanisms.
- **Persistence errors** (e.g., Local Storage quota exceeded) must be caught and surfaced to the user without crashing the app.
