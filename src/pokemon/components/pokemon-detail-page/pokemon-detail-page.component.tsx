"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PokemonDetailStatus } from "@pokemon/enums/pokemon-detail-status.enum";
import type { PokemonDetailPageProps } from "@pokemon/types/pokemon-detail.types";
import { usePokemonDetail } from "@pokemon/hooks/use-pokemon-detail.hook";
import { usePokemonDetailStore } from "@pokemon/store/pokemon-detail.store";
import { PokemonDetailHeader } from "@pokemon/components/pokemon-detail-header/pokemon-detail-header.component";
import { PokemonDetailStatusIndicator } from "@pokemon/components/pokemon-detail-status-indicator/pokemon-detail-status-indicator.component";
import { PokemonDetailImage } from "@pokemon/components/pokemon-detail-image/pokemon-detail-image.component";
import { PokemonDetailTypes } from "@pokemon/components/pokemon-detail-types/pokemon-detail-types.component";
import { PokemonDetailCatchSlot } from "@pokemon/components/pokemon-detail-catch-slot/pokemon-detail-catch-slot.component";
import { PokemonDetailFavoriteSlot } from "@pokemon/components/pokemon-detail-favorite-slot/pokemon-detail-favorite-slot.component";

function PokemonDetailPage({ idOrName }: PokemonDetailPageProps) {
  const router = useRouter();
  const { detail, status, retry } = usePokemonDetail(idOrName);
  const clearCurrentDetail = usePokemonDetailStore(
    (state) => state.clearCurrentDetail
  );

  useEffect(() => {
    return () => {
      clearCurrentDetail();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const isSuccess = useMemo(
    () => status === PokemonDetailStatus.Success && detail !== null,
    [status, detail]
  );

  const formattedId = useMemo(() => {
    if (!detail) return "";
    return `#${String(detail.id).padStart(3, "0")}`;
  }, [detail]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {isSuccess && detail && (
        <PokemonDetailHeader
          name={detail.name}
          id={detail.id}
          onBack={handleBack}
          favoriteSlot={<PokemonDetailFavoriteSlot />}
        />
      )}

      <PokemonDetailStatusIndicator status={status} onRetry={retry} />

      {isSuccess && detail && (
        <>
          <PokemonDetailImage imageUrl={detail.imageUrl} altText={detail.name} />
          <div className="flex flex-col gap-5 rounded-t-[28px] px-6 pt-5 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between">
              <h1 className="font-heading text-[28px] font-extrabold capitalize text-zinc-900">
                {detail.name}
              </h1>
              <span className="font-heading text-xl font-bold text-zinc-300">
                {formattedId}
              </span>
            </div>
            <PokemonDetailTypes types={detail.types} />
            <PokemonDetailCatchSlot pokemon={detail} />
          </div>
        </>
      )}
    </div>
  );
}

export { PokemonDetailPage };
