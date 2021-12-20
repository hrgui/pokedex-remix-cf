import { Pokemon, PokemonSpecies } from "pokenode-ts";
import list from "~/data/list.json";
import { chunk, map, flatten, uniq, startCase } from "lodash";

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

export function urlSearchParamsToObject(urlSearchParams: URLSearchParams) {
  const result: { [name: string]: string[] } = {};
  const entries = urlSearchParams.entries();

  for (const [key, value] of entries) {
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(value);
  }

  return result;
}

function filterPokemon(list: any[], filters: { [name: string]: string[] }) {
  const filterEntries = Object.entries(filters);

  for (const [filterKey, filterValues] of filterEntries) {
    list = list.filter((item) => {
      if (Array.isArray(item[filterKey])) {
        return item[filterKey].some((i: string) => filterValues.includes(i));
      }

      return item[filterKey] === undefined || filterValues.includes(item[filterKey]);
    });
  }
  return list;
}

export function listPokemon(page: number, filterParams: URLSearchParams) {
  const filters = urlSearchParamsToObject(filterParams);
  let _list = filterPokemon(list, filters);
  const pages = chunk(_list, 12);
  return {
    results: pages[page],
    maxPages: pages.length,
  };
}

export function getOptions(key: string) {
  return uniq(flatten(map(list, key))).map((v) => ({ name: startCase(v), value: v }));
}
