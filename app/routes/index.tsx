import classNames from "classnames";
import { startCase } from "lodash";
import chroma from "chroma-js";
import { Link, LoaderFunction, useLoaderData, useSearchParams } from "remix";
import { getOptions, listPokemon, urlSearchParamsToObject } from "~/models/pokemon";
import { DynamicJson } from "@hrgui/react-dynamic-json";
import filterConfigs from "~/data/filters.json";
import * as filterRegistry from "~/components/filters";

export const loader: LoaderFunction = async ({ request }) => {
  let url = new URL(request.url);
  let page = url.searchParams.get("page");
  const currentPage = +page! || 1;

  const { results, maxPages } = listPokemon(currentPage - 1, url.searchParams);

  return {
    results,
    currentPage,
    maxPages,
    filterValues: urlSearchParamsToObject(url.searchParams),
  };
};

export function Pagination({ currentPage, maxPages }: { currentPage: number; maxPages: number }) {
  const [searchParams] = useSearchParams();

  function getSearchParamsStringWithPage(page: number) {
    const _searchParams = new URLSearchParams(searchParams.toString());
    _searchParams.set("page", page + "");
    return _searchParams.toString();
  }

  return (
    <div className="flex justify-around items-center">
      <Link
        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-4"
        to={`/?${getSearchParamsStringWithPage(currentPage > 1 ? currentPage - 1 : maxPages)}`}
      >
        Prev
      </Link>

      <div>
        {currentPage} of {maxPages}
      </div>

      <Link
        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-4"
        to={`/?${getSearchParamsStringWithPage(currentPage < maxPages ? currentPage + 1 : 1)}`}
      >
        Next
      </Link>
    </div>
  );
}

export function getGradientFromPokemonColor(color: string) {
  return chroma(color).alpha(0.2);
}

export function PokemonGrid({ results }: { results: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:ml-4 mt-4">
      {results?.map((result) => (
        <Link
          className="col-span-4 transition ease-in-out hover:-translate-y-1 hover:scale-110 focus:scale-110 delay-150 m-2 sm:col-span-1"
          to={`/pokemon/${result.id}`}
        >
          <div key={result.id} className="rounded relative">
            <div
              className={classNames("p-4 bg-gradient-to-br")}
              style={{
                backgroundImage: `linear-gradient(to bottom right, ${getGradientFromPokemonColor(
                  result.color
                )}, var(--tw-gradient-to, transparent))`,
              }}
            >
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
    <div className="w-full sm:w-64 flex-none mt-6 p-4 rounded bg-slate-100">
      <header className="flex justify-between">
        <div className="text-bold">Filters</div>
        <div>
          <Link to="/" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
            Reset
          </Link>
        </div>
      </header>
      {filterConfigs.map((filterConfig) => {
        return (
          <div key={filterConfig.props.name}>
            <DynamicJson
              registry={filterRegistry}
              component={filterConfig.component}
              props={{
                ...filterConfig.props,
                value: value?.[filterConfig.props.name],
                options:
                  filterConfig.component !== "TextFilter" && getOptions(filterConfig.props.name),
              }}
            />
          </div>
        );
      })}
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
