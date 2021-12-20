import React from "react";
import FilterContainer from "./layout/FilterContainer";
import FilterTitle from "./layout/FilterTitle";

interface Props {
  title?: string;
  name?: string;
}

export const MinMaxSliderFilter = (props: Props) => {
  return (
    <FilterContainer>
      <FilterTitle name={props.name} title={props.title} />
    </FilterContainer>
  );
};

export default MinMaxSliderFilter;
