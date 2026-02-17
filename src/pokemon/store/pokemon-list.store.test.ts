import { act } from "@testing-library/react";
import { PokemonListStatus } from "@pokemon/enums/pokemon-list-status.enum";
import type { PokemonListItem } from "@pokemon/types/pokemon-list.types";
import { usePokemonListStore } from "./pokemon-list.store";

const BULBASAUR: PokemonListItem = {
  id: 1,
  name: "bulbasaur",
  spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
  types: ["grass", "poison"],
};

const CHARMANDER: PokemonListItem = {
  id: 4,
  name: "charmander",
  spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
  types: ["fire"],
};

describe("usePokemonListStore", () => {
  beforeEach(() => {
    act(() => {
      usePokemonListStore.getState().reset();
    });
  });

  it("should have correct initial state", () => {
    const state = usePokemonListStore.getState();
    expect(state.items).toEqual([]);
    expect(state.status).toBe(PokemonListStatus.Idle);
    expect(state.searchQuery).toBe("");
    expect(state.currentOffset).toBe(0);
    expect(state.totalCount).toBe(0);
  });

  it("should set items", () => {
    act(() => {
      usePokemonListStore.getState().setItems([BULBASAUR, CHARMANDER]);
    });
    expect(usePokemonListStore.getState().items).toEqual([BULBASAUR, CHARMANDER]);
  });

  it("should append items", () => {
    act(() => {
      usePokemonListStore.getState().setItems([BULBASAUR]);
    });
    act(() => {
      usePokemonListStore.getState().appendItems([CHARMANDER]);
    });
    expect(usePokemonListStore.getState().items).toEqual([BULBASAUR, CHARMANDER]);
  });

  it("should deduplicate when appending items with existing IDs", () => {
    act(() => {
      usePokemonListStore.getState().setItems([BULBASAUR, CHARMANDER]);
    });
    act(() => {
      usePokemonListStore.getState().appendItems([BULBASAUR, CHARMANDER]);
    });
    expect(usePokemonListStore.getState().items).toEqual([BULBASAUR, CHARMANDER]);
  });

  it("should set status", () => {
    act(() => {
      usePokemonListStore.getState().setStatus(PokemonListStatus.Loading);
    });
    expect(usePokemonListStore.getState().status).toBe(PokemonListStatus.Loading);
  });

  it("should set status to LoadingMore", () => {
    act(() => {
      usePokemonListStore.getState().setStatus(PokemonListStatus.LoadingMore);
    });
    expect(usePokemonListStore.getState().status).toBe(PokemonListStatus.LoadingMore);
  });

  it("should set search query", () => {
    act(() => {
      usePokemonListStore.getState().setSearchQuery("pika");
    });
    expect(usePokemonListStore.getState().searchQuery).toBe("pika");
  });

  it("should set current offset", () => {
    act(() => {
      usePokemonListStore.getState().setCurrentOffset(20);
    });
    expect(usePokemonListStore.getState().currentOffset).toBe(20);
  });

  it("should set total count", () => {
    act(() => {
      usePokemonListStore.getState().setTotalCount(1302);
    });
    expect(usePokemonListStore.getState().totalCount).toBe(1302);
  });

  it("should reset to initial state", () => {
    act(() => {
      usePokemonListStore.getState().setItems([BULBASAUR]);
      usePokemonListStore.getState().setStatus(PokemonListStatus.Success);
      usePokemonListStore.getState().setSearchQuery("bulba");
      usePokemonListStore.getState().setCurrentOffset(20);
      usePokemonListStore.getState().setTotalCount(100);
    });

    act(() => {
      usePokemonListStore.getState().reset();
    });

    const state = usePokemonListStore.getState();
    expect(state.items).toEqual([]);
    expect(state.status).toBe(PokemonListStatus.Idle);
    expect(state.searchQuery).toBe("");
    expect(state.currentOffset).toBe(0);
    expect(state.totalCount).toBe(0);
  });
});
