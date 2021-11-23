import { useLoaderData, Link } from "remix";
import type { LoaderFunction } from "remix";
import { Pokemon, PokemonSpecies } from "pokenode-ts";
import invariant from "tiny-invariant";
import { capitalize } from "lodash";

import type { MetaFunction } from "remix";

type PokemonData = {
  pokemon: Pokemon;
  species: PokemonSpecies;
};

export let meta: MetaFunction = ({ data }: { data: PokemonData }) => {
  const { pokemon, species } = data;

  const title = `${capitalize(pokemon.name)} #${pokemon.id}`;
  const description = `${species.flavor_text_entries[0].flavor_text}`;
  const image = pokemon?.sprites?.other?.["official-artwork"]?.front_default;
  return {
    title,
    "twitter:title": title,
    description,
    "twitter:description": description,
    "og:description": description,
    "twitter:image": image,
    "og:image": image,
  };
};

async function getPokemonById(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await res.json();
  return pokemon;
}

async function getPokemonSpeciesById(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  const pokemon = await res.json();
  return pokemon;
}

export let loader: LoaderFunction = async ({ params }) => {
  invariant(+params.id! >= 1, "Pokemon ID must be greater than 0 and must be a ID");
  const pokemon = await getPokemonById(params.id);
  const pokemonSpecies = await getPokemonSpeciesById(params.id);
  return { pokemon, species: pokemonSpecies };
};

export default function () {
  const { pokemon } = useLoaderData<PokemonData>();

  return (
    <div className="flex flex-col">
      <img className="" src={pokemon?.sprites?.other?.["official-artwork"]?.front_default} />
      <h1 className="text-8xl font-semibold flex capitalize justify-center">
        {pokemon.name} #{pokemon.id}
      </h1>
      <div className="flex justify-around">
        {pokemon.id > 1 && (
          <Link
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-4"
            to={`/pokemon/${pokemon.id - 1}`}
          >
            Previous
          </Link>
        )}
        <Link
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-4"
          to={`/pokemon/${pokemon.id + 1}`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
