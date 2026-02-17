"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CatchStatus } from "@pokedex/enums/catch-status.enum";
import type { PokedexStore } from "@pokedex/types/pokedex.types";
import { POKEDEX_STORAGE_KEY } from "@pokedex/persistence/pokedex.persistence";

const usePokedexStore = create<PokedexStore>()(
  persist(
    (set, get) => ({
      collection: [],
      hydrated: false,

      catchPokemon: (pokemon) => {
        const { collection } = get();
        if (collection.some((p) => p.id === pokemon.id)) return;
        set({
          collection: [
            ...collection,
            { ...pokemon, caughtAt: new Date().toISOString() },
          ],
        });
      },

      releasePokemon: (pokemonId) => {
        const { collection } = get();
        if (!collection.some((p) => p.id === pokemonId)) return;
        set({ collection: collection.filter((p) => p.id !== pokemonId) });
      },

      setCollection: (collection) => set({ collection }),

      setHydrated: (hydrated) => set({ hydrated }),

      isCaught: (pokemonId) =>
        get().collection.some((p) => p.id === pokemonId),

      getCatchStatus: (pokemonId) =>
        get().collection.some((p) => p.id === pokemonId)
          ? CatchStatus.Caught
          : CatchStatus.Uncaught,

      collectionCount: () => get().collection.length,
    }),
    {
      name: POKEDEX_STORAGE_KEY,
      skipHydration: true,
      partialize: (state) => ({
        collection: state.collection,
      }),
    }
  )
);

export { usePokedexStore };
