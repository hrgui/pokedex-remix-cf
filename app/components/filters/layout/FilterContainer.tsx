import React from "react";

interface Props {
  children?: any;
}

const FilterContainer = (props: Props) => {
  return <div className="pt-4 pb-4 border-b-2 border-b-slate-300">{props.children}</div>;
};

export default FilterContainer;
