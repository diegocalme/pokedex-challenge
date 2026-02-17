import { act } from "@testing-library/react";
import { CatchStatus } from "@pokedex/enums/catch-status.enum";
import type { CaughtPokemon } from "@pokedex/types/pokedex.types";
import { usePokedexStore } from "./pokedex.store";

const PIKACHU: Omit<CaughtPokemon, "caughtAt"> = {
  id: 25,
  name: "pikachu",
  imageUrl: "https://example.com/pikachu.png",
  types: ["electric"],
};

const CHARMANDER: Omit<CaughtPokemon, "caughtAt"> = {
  id: 4,
  name: "charmander",
  imageUrl: "https://example.com/charmander.png",
  types: ["fire"],
};

describe("usePokedexStore", () => {
  beforeEach(() => {
    act(() => {
      usePokedexStore.getState().setCollection([]);
      usePokedexStore.getState().setHydrated(false);
    });
  });

  it("should have correct initial state", () => {
    const state = usePokedexStore.getState();
    expect(state.collection).toEqual([]);
    expect(state.hydrated).toBe(false);
  });

  describe("catchPokemon", () => {
    it("should add a pokemon to the collection with caughtAt timestamp", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-15T10:30:00.000Z"));

      act(() => {
        usePokedexStore.getState().catchPokemon(PIKACHU);
      });

      const { collection } = usePokedexStore.getState();
      expect(collection).toHaveLength(1);
      expect(collection[0]).toEqual({
        ...PIKACHU,
        caughtAt: "2026-01-15T10:30:00.000Z",
      });

      vi.useRealTimers();
    });

    it("should not create a duplicate when catching an already-caught pokemon (E-1)", () => {
      act(() => {
        usePokedexStore.getState().catchPokemon(PIKACHU);
      });

      const stateBefore = usePokedexStore.getState();
      const collectionBefore = stateBefore.collection;

      act(() => {
        usePokedexStore.getState().catchPokemon(PIKACHU);
      });

      const stateAfter = usePokedexStore.getState();
      expect(stateAfter.collection).toHaveLength(1);
      expect(stateAfter.collection).toBe(collectionBefore);
    });

    it("should add multiple different pokemon", () => {
      act(() => {
        usePokedexStore.getState().catchPokemon(PIKACHU);
        usePokedexStore.getState().catchPokemon(CHARMANDER);
      });

      expect(usePokedexStore.getState().collection).toHaveLength(2);
    });
  });

  describe("releasePokemon", () => {
    it("should remove a pokemon from the collection", () => {
      act(() => {
        usePokedexStore.getState().catchPokemon(PIKACHU);
        usePokedexStore.getState().catchPokemon(CHARMANDER);
      });

      act(() => {
        usePokedexStore.getState().releasePokemon(25);
      });

      const { collection } = usePokedexStore.getState();
      expect(collection).toHaveLength(1);
      expect(collection[0]!.name).toBe("charmander");
    });

    it("should be a no-op when releasing a pokemon not in the collection (E-2)", () => {
      act(() => {
        usePokedexStore.getState().catchPokemon(PIKACHU);
      });

      const collectionBefore = usePokedexStore.getState().collection;

      act(() => {
        usePokedexStore.getState().releasePokemon(999);
      });

      expect(usePokedexStore.getState().collection).toBe(collectionBefore);
    });
  });

  describe("setCollection", () => {
    it("should replace the entire collection", () => {
      const fullCollection: CaughtPokemon[] = [
        { ...PIKACHU, caughtAt: "2026-01-01T00:00:00.000Z" },
        { ...CHARMANDER, caughtAt: "2026-01-02T00:00:00.000Z" },
      ];

      act(() => {
        usePokedexStore.getState().setCollection(fullCollection);
      });

      expect(usePokedexStore.getState().collection).toEqual(fullCollection);
    });
  });

  describe("setHydrated", () => {
    it("should set the hydrated flag", () => {
      act(() => {
        usePokedexStore.getState().setHydrated(true);
      });

      expect(usePokedexStore.getState().hydrated).toBe(true);
    });
  });

  describe("isCaught", () => {
    it("should return true for a caught pokemon", () => {
      act(() => {
        usePokedexStore.getState().catchPokemon(PIKACHU);
      });

      expect(usePokedexStore.getState().isCaught(25)).toBe(true);
    });

    it("should return false for an uncaught pokemon", () => {
      expect(usePokedexStore.getState().isCaught(25)).toBe(false);
    });
  });

  describe("getCatchStatus", () => {
    it("should return Caught for a caught pokemon", () => {
      act(() => {
        usePokedexStore.getState().catchPokemon(PIKACHU);
      });

      expect(usePokedexStore.getState().getCatchStatus(25)).toBe(
        CatchStatus.Caught
      );
    });

    it("should return Uncaught for an uncaught pokemon", () => {
      expect(usePokedexStore.getState().getCatchStatus(25)).toBe(
        CatchStatus.Uncaught
      );
    });
  });

  describe("collectionCount", () => {
    it("should return 0 for an empty collection", () => {
      expect(usePokedexStore.getState().collectionCount()).toBe(0);
    });

    it("should return the correct count", () => {
      act(() => {
        usePokedexStore.getState().catchPokemon(PIKACHU);
        usePokedexStore.getState().catchPokemon(CHARMANDER);
      });

      expect(usePokedexStore.getState().collectionCount()).toBe(2);
    });
  });
});
