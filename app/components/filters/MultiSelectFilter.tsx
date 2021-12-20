import React from "react";
import { startCase } from "lodash";
import FilterContainer from "./layout/FilterContainer";
import FilterTitle from "./layout/FilterTitle";

export interface MultiSelectFilterProps {
  name?: string;
  title?: string;
  options?: { name: string; value: string }[];
}

export const MultiSelectFilter = (props: MultiSelectFilterProps) => {
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
          />
          <span>{option.name}</span>
        </label>
      ))}
    </FilterContainer>
  );
};

export default MultiSelectFilter;
