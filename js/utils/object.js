export function removeKey(obj, key) {
  const { [key]: omit, ...rest } = obj;

  return rest;
}

