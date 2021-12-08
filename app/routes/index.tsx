import type { LoaderFunction } from "remix";
import { redirect } from "remix";

export const loader: LoaderFunction = async () => {
  return redirect("/pokemon/1");
};

export default function () {
  return <div>Hello World</div>;
}
