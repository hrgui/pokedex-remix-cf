import { useLoaderData, Link } from "remix";
import type { LoaderFunction } from "remix";
import { capitalize, startCase } from "lodash";
import classNames from "classnames";

import type { MetaFunction } from "remix";
import { getPokemonById, getPokemonSpeciesById, PokemonData } from "~/models/pokemon";
import {
  Pokemon,
  PokemonMove,
  PokemonSpecies,
  PokemonSprites,
  PokemonStat,
  PokemonType,
} from "pokenode-ts";
import JSONTree from "react-json-tree";
import { flat } from "~/utils";
import { useMemo, useState } from "react";

export let meta: MetaFunction = ({ data }: { data: PokemonData }) => {
  const { pokemon, species } = data;

  const title = `${capitalize(pokemon.name)} #${pokemon.id}`;
  const description = getDescription(data.species);
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

export let loader: LoaderFunction = async ({ params }) => {
  // invariant(+params.id! >= 1, "Pokemon ID must be greater than 0 and must be a ID");
  const pokemon = await getPokemonById(params.id!);
  const pokemonSpecies = await getPokemonSpeciesById(params.id!);
  return { pokemon, species: pokemonSpecies };
};

export function PokemonMoves({ moves }: { moves: PokemonMove[] }) {
  if (!moves.length) {
    return null;
  }

  return (
    <div>
      <h3 className="text-4xl mb-2 mt-2 uppercase">moves</h3>
      {moves.map((move, idx) => (
        <div key={idx} className="mb-2 grid grid-cols-3 gap-4">
          <div className="col-span-1">{startCase(move.move.name)}</div>
          <div className="col-span-2">
            {move.version_group_details.map((vgd) => (
              <div key={vgd.version_group.name}>
                {startCase(vgd.version_group.name)} ({startCase(vgd.move_learn_method.name)})
                {vgd.level_learned_at > 0 && `- Lv.${vgd.level_learned_at}`}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PokemonTypes({ types }: { types: PokemonType[] }) {
  const typeToColor = (type: string) => {
    const colors: { [name: string]: string } = {
      normal: "bg-slate-200",
      flying: "bg-sky-50",
      dark: "bg-gray-600 text-white",
      fire: "bg-orange-200",
      fighting: "bg-orange-700 text-white",
      bug: "bg-green-200",
      grass: "bg-lime-200",
      ice: "bg-cyan-200",
      psychic: "bg-purple-200",
      poison: "bg-fuchsia-200",
      steel: "bg-zinc-200",
      rock: "bg-stone-200",
      ground: "bg-stone-500 text-white",
      electric: "bg-yellow-200",
      water: "bg-blue-200",
      fairy: "bg-pink-200",
      dragon: "bg-sky-800 text-white",
      ghost: "bg-fuchsia-800 text-white",
    };

    return colors[type] || "bg-slate-200";
  };

  return (
    <div className="flex">
      {types.map((type) => (
        <div
          key={type.type.name}
          className={classNames(
            "uppercase mb-2 mr-2 mt-2 p-2 rounded",
            typeToColor(type.type.name)
          )}
        >
          {type.type.name}
        </div>
      ))}
    </div>
  );
}

export function PokemonSprites({ sprites }: { sprites: PokemonSprites }) {
  const flatSprites = useMemo(() => flat(sprites), [sprites]);
  const flatSpriteEntries = useMemo(
    () => Object.entries(flatSprites).filter(([key, value]) => Boolean(value)),
    [flatSprites]
  );
  const [selectedKey, setSelectedKey] = useState("other.official-artwork.front_default");

  return (
    <div>
      <img className="w-full" src={flatSprites[selectedKey]} />
      <select
        className="max-w-full bg-slate-100 p-2 rounded"
        value={selectedKey}
        onChange={(e) => setSelectedKey(e.target.value)}
      >
        {flatSpriteEntries.map(([key]) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
}

export function PokemonHero({ pokemon, description }: { pokemon: Pokemon; description: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="col-span-1 sm:sticky sm:top-0 sm:self-start">
        <PokemonSprites sprites={pokemon.sprites} />

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

      <div className="col-span-2 m-4">
        <h1 className="text-5xl sm:text-7xl mb-2 font-semibold flex capitalize">
          {pokemon.name} #{pokemon.id}
        </h1>
        <PokemonTypes types={pokemon.types} />
        <p className="text-xl sm:text-2xl leading-8 mb-6 mt-2">{description}</p>

        <div className="mt-2 mb-6">
          <PokemonStats stats={pokemon.stats} height={pokemon.height} weight={pokemon.weight} />
        </div>
      </div>
    </div>
  );
}

export function PokemonHeight({ height }: { height: number }) {
  const feet = Math.floor(height / 12);
  const inches = height % 12;

  return (
    <>
      {feet && `${feet}'`} {`${inches}"`}
    </>
  );
}

export function PokemonStats({
  height,
  weight,
  stats,
}: {
  height: number;
  weight: number;
  stats: PokemonStat[];
}) {
  return (
    <>
      <h3 className="text-4xl mt-2 mb-2 uppercase">stats</h3>
      <div className="grid grid-cols-4 sm:grid-cols-12 mt-2 mb-2">
        <div className="col-span-1 sm:col-span-2">Height</div>
        <div className="sm:col-span-10">
          <PokemonHeight height={Math.round(height * 3.937)} />
        </div>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-12 mt-2 mb-2">
        <div className="col-span-1 sm:col-span-2">Weight</div>
        <div className="sm:col-span-10">{(weight / 4.536).toFixed(1)} lbs</div>
      </div>
      {stats.map((pokemonStat, idx) => {
        return (
          <div className="grid grid-cols-4 sm:grid-cols-12 mt-2 mb-2" key={pokemonStat.stat.name}>
            <div className="col-span-1 sm:col-span-2">{startCase(pokemonStat.stat.name)}</div>

            <div
              className="rounded col-span-3 sm:col-span-10 h-6 text-white bg-lime-800 flex justify-center"
              style={{ width: `${(pokemonStat.base_stat / 255) * 100}%` }}
            >
              {pokemonStat.base_stat}
            </div>
          </div>
        );
      })}
    </>
  );
}

export function getDescription(species: PokemonSpecies, locale = "en") {
  const flavor_texts = species.flavor_text_entries.filter((ft) => ft.language.name === locale);
  return flavor_texts[0].flavor_text;
}

export default function () {
  const { pokemon, species } = useLoaderData<PokemonData>();

  return (
    <div>
      <PokemonHero pokemon={pokemon} description={getDescription(species, "en")} />
    </div>
  );
}
