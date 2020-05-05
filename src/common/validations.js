export function isValidDirection(value) {
  return !!/^[a-zA-Z0-9\s,'-]*$/g.exec(value);
}
