"use client";

import { useCallback, useEffect, useMemo } from "react";
import { usePokedexStore } from "@pokedex/store/pokedex.store";
import { POKEDEX_STORAGE_KEY } from "@pokedex/persistence/pokedex.persistence";
import type {
  CaughtPokemon,
  UsePokedexReturn,
} from "@pokedex/types/pokedex.types";

function usePokedex(): UsePokedexReturn {
  const collection = usePokedexStore((s) => s.collection);
  const hydrated = usePokedexStore((s) => s.hydrated);
  const storeCatch = usePokedexStore((s) => s.catchPokemon);
  const storeRelease = usePokedexStore((s) => s.releasePokemon);
  const storeSetCollection = usePokedexStore((s) => s.setCollection);
  const storeIsCaught = usePokedexStore((s) => s.isCaught);
  const storeGetCatchStatus = usePokedexStore((s) => s.getCatchStatus);

  useEffect(() => {
    const unsubFinishHydration = usePokedexStore.persist.onFinishHydration(
      () => {
        usePokedexStore.getState().setHydrated(true);
      }
    );
    usePokedexStore.persist.rehydrate();
    return unsubFinishHydration;
  }, []);

  useEffect(() => {
    function handleStorageEvent(event: StorageEvent): void {
      if (event.key !== POKEDEX_STORAGE_KEY) return;
      if (!event.newValue) return;

      try {
        const envelope = JSON.parse(event.newValue) as {
          state?: { collection?: CaughtPokemon[] };
        };
        const synced = envelope?.state?.collection;
        if (Array.isArray(synced)) {
          storeSetCollection(synced);
        }
      } catch {
        // E-6: corrupted data — ignore silently
      }
    }

    window.addEventListener("storage", handleStorageEvent);
    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [storeSetCollection]);

  const count = useMemo(() => collection.length, [collection]);

  const catchPokemon = useCallback(
    (pokemon: Omit<CaughtPokemon, "caughtAt">) => {
      storeCatch(pokemon);
    },
    [storeCatch]
  );

  const releasePokemon = useCallback(
    (pokemonId: number) => {
      storeRelease(pokemonId);
    },
    [storeRelease]
  );

  const isCaught = useCallback(
    (pokemonId: number) => storeIsCaught(pokemonId),
    [storeIsCaught]
  );

  const getCatchStatus = useCallback(
    (pokemonId: number) => storeGetCatchStatus(pokemonId),
    [storeGetCatchStatus]
  );

  return {
    collection,
    count,
    hydrated,
    catchPokemon,
    releasePokemon,
    isCaught,
    getCatchStatus,
  };
}

export { usePokedex };
