"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PokemonListStatus } from "@pokemon/enums/pokemon-list-status.enum";
import type { PokemonListStore } from "@pokemon/types/pokemon-list.types";
import { POKEMON_LIST_STORAGE_KEY } from "@pokemon/persistence/pokemon-list.persistence";

const INITIAL_STATE = {
  items: [] as PokemonListStore["items"],
  status: PokemonListStatus.Idle,
  searchQuery: "",
  currentOffset: 0,
  totalCount: 0,
};

const usePokemonListStore = create<PokemonListStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setItems: (items) => set({ items }),

      appendItems: (newItems) =>
        set((state) => {
          const existingIds = new Set(state.items.map((item) => item.id));
          const uniqueItems = newItems.filter((item) => !existingIds.has(item.id));
          return { items: [...state.items, ...uniqueItems] };
        }),

      setStatus: (status) => set({ status }),

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      setCurrentOffset: (currentOffset) => set({ currentOffset }),

      setTotalCount: (totalCount) => set({ totalCount }),

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: POKEMON_LIST_STORAGE_KEY,
      skipHydration: true,
      partialize: (state) => ({
        items: state.items,
        currentOffset: state.currentOffset,
        totalCount: state.totalCount,
      }),
    }
  )
);

export { usePokemonListStore };
