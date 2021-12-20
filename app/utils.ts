export const flat = (obj: { [name: string]: any }, concatenator = "."): { [name: string]: any } =>
  Object.keys(obj).reduce((acc, key) => {
    if (typeof obj[key] !== "object" || !obj[key]) {
      return {
        ...acc,
        [key]: obj[key],
      };
    }

    const flattenedChild = flat(obj[key], concatenator);

    return {
      ...acc,
      ...Object.keys(flattenedChild).reduce(
        (childAcc, childKey) => ({
          ...childAcc,
          [`${key}${concatenator}${childKey}`]: flattenedChild[childKey],
        }),
        {}
      ),
    };
  }, {});
