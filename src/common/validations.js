export function isValidDirection(value) {
  return !/([\°|\||\¿|\?|#|!|¡])/g.exec(value);;
}
