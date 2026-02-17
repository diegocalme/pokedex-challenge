import { renderHook, act } from "@testing-library/react";
import { CatchStatus } from "@pokedex/enums/catch-status.enum";
import type { CaughtPokemon } from "@pokedex/types/pokedex.types";
import { usePokedexStore } from "@pokedex/store/pokedex.store";
import { POKEDEX_STORAGE_KEY } from "@pokedex/persistence/pokedex.persistence";
import { usePokedex } from "./use-pokedex.hook";

const PIKACHU: Omit<CaughtPokemon, "caughtAt"> = {
  id: 25,
  name: "pikachu",
  imageUrl: "https://example.com/pikachu.png",
  types: ["electric"],
};

describe("usePokedex", () => {
  beforeEach(() => {
    act(() => {
      usePokedexStore.getState().setCollection([]);
      usePokedexStore.getState().setHydrated(false);
    });
    localStorage.clear();
  });

  it("should expose collection, count, and hydrated from the store", () => {
    act(() => {
      usePokedexStore.getState().setHydrated(true);
    });

    const { result } = renderHook(() => usePokedex());

    expect(result.current.collection).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.hydrated).toBe(true);
  });

  it("should expose catchPokemon and update the store", () => {
    act(() => {
      usePokedexStore.getState().setHydrated(true);
    });

    const { result } = renderHook(() => usePokedex());

    act(() => {
      result.current.catchPokemon(PIKACHU);
    });

    expect(result.current.collection).toHaveLength(1);
    expect(result.current.collection[0]!.name).toBe("pikachu");
    expect(result.current.count).toBe(1);
  });

  it("should expose releasePokemon and update the store", () => {
    act(() => {
      usePokedexStore.getState().setHydrated(true);
      usePokedexStore.getState().catchPokemon(PIKACHU);
    });

    const { result } = renderHook(() => usePokedex());

    act(() => {
      result.current.releasePokemon(25);
    });

    expect(result.current.collection).toHaveLength(0);
    expect(result.current.count).toBe(0);
  });

  it("should expose isCaught", () => {
    act(() => {
      usePokedexStore.getState().setHydrated(true);
      usePokedexStore.getState().catchPokemon(PIKACHU);
    });

    const { result } = renderHook(() => usePokedex());

    expect(result.current.isCaught(25)).toBe(true);
    expect(result.current.isCaught(4)).toBe(false);
  });

  it("should expose getCatchStatus", () => {
    act(() => {
      usePokedexStore.getState().setHydrated(true);
      usePokedexStore.getState().catchPokemon(PIKACHU);
    });

    const { result } = renderHook(() => usePokedex());

    expect(result.current.getCatchStatus(25)).toBe(CatchStatus.Caught);
    expect(result.current.getCatchStatus(4)).toBe(CatchStatus.Uncaught);
  });

  describe("cross-tab sync (E-8)", () => {
    it("should update the store when a storage event fires for the pokedex key", () => {
      act(() => {
        usePokedexStore.getState().setHydrated(true);
      });

      renderHook(() => usePokedex());

      const newCollection: CaughtPokemon[] = [
        {
          ...PIKACHU,
          caughtAt: "2026-01-15T10:30:00.000Z",
        },
      ];

      const envelope = JSON.stringify({
        state: { collection: newCollection },
        version: 0,
      });

      act(() => {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: POKEDEX_STORAGE_KEY,
            newValue: envelope,
          })
        );
      });

      expect(usePokedexStore.getState().collection).toEqual(newCollection);
    });

    it("should ignore storage events for other keys", () => {
      act(() => {
        usePokedexStore.getState().setHydrated(true);
      });

      renderHook(() => usePokedex());

      act(() => {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "some-other-key",
            newValue: "{}",
          })
        );
      });

      expect(usePokedexStore.getState().collection).toEqual([]);
    });

    it("should handle corrupted storage data gracefully (E-6)", () => {
      act(() => {
        usePokedexStore.getState().setHydrated(true);
      });

      renderHook(() => usePokedex());

      act(() => {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: POKEDEX_STORAGE_KEY,
            newValue: "not-valid-json{{{",
          })
        );
      });

      expect(usePokedexStore.getState().collection).toEqual([]);
    });

    it("should handle null newValue from storage event", () => {
      act(() => {
        usePokedexStore.getState().setHydrated(true);
      });

      renderHook(() => usePokedex());

      act(() => {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: POKEDEX_STORAGE_KEY,
            newValue: null,
          })
        );
      });

      expect(usePokedexStore.getState().collection).toEqual([]);
    });
  });

  it("should clean up the storage event listener on unmount", () => {
    act(() => {
      usePokedexStore.getState().setHydrated(true);
    });

    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => usePokedex());

    expect(addSpy).toHaveBeenCalledWith("storage", expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("storage", expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
