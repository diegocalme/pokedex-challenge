import { PokemonDetailPage } from "@pokemon/components/pokemon-detail-page/pokemon-detail-page.component";

export default async function PokemonDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PokemonDetailPage idOrName={id} />;
}
