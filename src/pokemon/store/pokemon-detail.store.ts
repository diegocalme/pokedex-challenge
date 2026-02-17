"use client";

import { create } from "zustand";
import { PokemonDetailStatus } from "@pokemon/enums/pokemon-detail-status.enum";
import type { PokemonDetailStore } from "@pokemon/types/pokemon-detail.types";

const INITIAL_STATE = {
  currentDetail: null as PokemonDetailStore["currentDetail"],
  status: PokemonDetailStatus.Idle,
};

const usePokemonDetailStore = create<PokemonDetailStore>()((set) => ({
  ...INITIAL_STATE,

  setCurrentDetail: (detail) => set({ currentDetail: detail }),

  setStatus: (status) => set({ status }),

  clearCurrentDetail: () => set(INITIAL_STATE),
}));

export { usePokemonDetailStore };
