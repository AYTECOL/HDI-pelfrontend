export function isValidDirection(value) {
  return !!/^([a-zA-Z0-9 -])+$/.test(value);
}
