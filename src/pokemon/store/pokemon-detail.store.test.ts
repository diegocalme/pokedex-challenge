import { act } from "@testing-library/react";
import { PokemonDetailStatus } from "@pokemon/enums/pokemon-detail-status.enum";
import type { PokemonDetailDisplay } from "@pokemon/types/pokemon-detail.types";
import { usePokemonDetailStore } from "./pokemon-detail.store";

const PIKACHU: PokemonDetailDisplay = {
  id: 25,
  name: "pikachu",
  imageUrl: "https://example.com/pikachu.png",
  types: ["electric"],
};

describe("usePokemonDetailStore", () => {
  beforeEach(() => {
    act(() => {
      usePokemonDetailStore.getState().clearCurrentDetail();
    });
  });

  it("should have correct initial state", () => {
    const state = usePokemonDetailStore.getState();
    expect(state.currentDetail).toBeNull();
    expect(state.status).toBe(PokemonDetailStatus.Idle);
  });

  it("should set current detail", () => {
    act(() => {
      usePokemonDetailStore.getState().setCurrentDetail(PIKACHU);
    });
    expect(usePokemonDetailStore.getState().currentDetail).toEqual(PIKACHU);
  });

  it("should set status", () => {
    act(() => {
      usePokemonDetailStore.getState().setStatus(PokemonDetailStatus.Loading);
    });
    expect(usePokemonDetailStore.getState().status).toBe(PokemonDetailStatus.Loading);
  });

  it("should set status to NotFound", () => {
    act(() => {
      usePokemonDetailStore.getState().setStatus(PokemonDetailStatus.NotFound);
    });
    expect(usePokemonDetailStore.getState().status).toBe(PokemonDetailStatus.NotFound);
  });

  it("should clear current detail and reset status to Idle", () => {
    act(() => {
      usePokemonDetailStore.getState().setCurrentDetail(PIKACHU);
      usePokemonDetailStore.getState().setStatus(PokemonDetailStatus.Success);
    });

    act(() => {
      usePokemonDetailStore.getState().clearCurrentDetail();
    });

    const state = usePokemonDetailStore.getState();
    expect(state.currentDetail).toBeNull();
    expect(state.status).toBe(PokemonDetailStatus.Idle);
  });
});
