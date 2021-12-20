import React from "react";
import { startCase } from "lodash";
import { MultiSelectFilter, MultiSelectFilterProps } from ".";

export const ColorFilter = (props: MultiSelectFilterProps) => {
  return <MultiSelectFilter {...props} />;
};

export default ColorFilter;
