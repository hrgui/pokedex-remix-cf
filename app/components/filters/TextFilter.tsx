import React from "react";

interface Props {}

export const TextFilter = (props: Props) => {
  return (
    <div className="pt-4 pb-4 border-b-2 border-b-slate-300">
      Pokemon Name
      <input type="text" className="w-full" value={props.value} />
    </div>
  );
};

export default TextFilter;
