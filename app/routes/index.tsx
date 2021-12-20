import { startCase } from "lodash";
import JSONTree from "react-json-tree";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { getMaxPages, listPokemon } from "~/models/pokemon";

export const loader: LoaderFunction = async ({ request }) => {
  let url = new URL(request.url);
  let page = url.searchParams.get("page");
  const currentPage = +page! || 1;

  return { results: listPokemon(currentPage - 1), currentPage, maxPages: getMaxPages() };
};

export function Pagination({ currentPage, maxPages }: { currentPage: number; maxPages: number }) {
  return (
    <div className="flex justify-around items-center">
      <Link
        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-4"
        to={`/?page=${currentPage > 1 ? currentPage - 1 : maxPages}`}
      >
        Prev
      </Link>

      <div>
        {currentPage} of {maxPages}
      </div>

      <Link
        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-4"
        to={`/?page=${currentPage < maxPages ? currentPage + 1 : 1}`}
      >
        Next
      </Link>
    </div>
  );
}

export function PokemonGrid({ results }: { results: any[] }) {
  return (
    <div className="grid grid-cols-4 gap-4 sm:ml-4 mt-4">
      {results.map((result) => (
        <Link className="col-span-4 m-2 sm:col-span-1" to={`/pokemon/${result.id}`}>
          <div key={result.id} className="rounded relative">
            <div
              className="p-4 absolute w-full h-full"
              style={{ backgroundColor: `${result.color}`, opacity: 0.1 }}
            ></div>
            <div className="p-4">
              <img src={result.image} alt={result.name} loading="lazy" className="min-w-full" />
            </div>
            <div className="text-white grid grid-cols-3 bg-black overflow-hidden rounded-b-lg">
              <div className="bg-red-500 col-span-1 p-2 pl-6 -skew-x-12 -ml-2">#{result.id}</div>
              <div className=" col-span-2 p-2 pl-4">{startCase(result.name)}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function PokemonFilters({ options, value }: { options: any; value: any }) {
  return (
    <div className="w-full sm:w-64 flex-none mt-6 p-4 rounded bg-red-200">
      <header className="flex justify-between">
        <div className="text-bold">Filters</div>
        <div>Reset</div>
      </header>
    </div>
  );
}

export default function () {
  const { results, filterOptions, filterValues, maxPages, currentPage } = useLoaderData<any>();
  return (
    <div>
      <div className="sm:flex">
        <PokemonFilters options={filterOptions} value={filterValues} />
        <PokemonGrid results={results} />
      </div>
      <Pagination currentPage={currentPage} maxPages={maxPages} />
    </div>
  );
}
