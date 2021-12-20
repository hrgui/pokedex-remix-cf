import { Pokemon, PokemonSpecies } from "pokenode-ts";
import list from "~/data/list.json";
import { chunk } from "lodash";

const pages = chunk(list, 12);
export type PokemonData = {
  pokemon: Pokemon;
  species: PokemonSpecies;
};

export async function getPokemonById(id: string): Promise<Pokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await res.json();
  return pokemon;
}

export async function getPokemonSpeciesById(id: string): Promise<PokemonSpecies> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  const pokemon = await res.json();
  return pokemon;
}

export function listPokemon(page: number) {
  return pages[page];
}

export function getMaxPages() {
  return pages.length;
}
