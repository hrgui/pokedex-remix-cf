import React from "react";
import { startCase } from "lodash";

interface Props {
  title?: string;
  name?: string;
}

const FilterTitle = (props: Props) => {
  return <div className="">{props.title || startCase(props.name)}</div>;
};

export default FilterTitle;
