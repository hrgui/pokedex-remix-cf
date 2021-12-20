import React from "react";
import { startCase } from "lodash";
import FilterContainer from "./layout/FilterContainer";
import FilterTitle from "./layout/FilterTitle";
import { useNavigate, useSearchParams } from "remix";

export interface MultiSelectFilterProps {
  name?: string;
  title?: string;
  value?: string[];
  options?: { name: string; value: string }[];
}

export const MultiSelectFilter = (props: MultiSelectFilterProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const value = props.value || [];

  return (
    <FilterContainer>
      <FilterTitle name={props.name} title={props.title} />
      {props.options?.map((option) => (
        <label className="flex items-center" key={option.value} htmlFor={option.name}>
          <input
            className="mr-2"
            name={props.name}
            id={option.name}
            value={option.value}
            type="checkbox"
            checked={value?.includes(option.value)}
            onChange={(e) => {
              const _searchParams = new URLSearchParams(searchParams.toString());

              if (e.target.checked) {
                _searchParams.append(props.name!, option.value);
              } else {
                const newValuesForKey = _searchParams
                  .getAll(props.name!)
                  .filter((x) => x != option.value);
                _searchParams.delete(props.name!);

                for (const value of newValuesForKey) {
                  _searchParams.append(props.name!, value);
                }
              }

              const search = _searchParams.toString();
              navigate(`?${search}`);
            }}
          />
          <span>{option.name}</span>
        </label>
      ))}
    </FilterContainer>
  );
};

export default MultiSelectFilter;
