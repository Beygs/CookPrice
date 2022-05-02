export const capitalize = (string: string): string =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const isEquivalent = (a: Object, b: Object) => {
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);

  if (aProps.length !== bProps.length) return false;

  for (let prop of aProps) {
    if (a[prop] !== b[prop]) return false;
  }

  return true;
}
