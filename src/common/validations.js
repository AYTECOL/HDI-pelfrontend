export function isValidDirection(value) {
  return !/[°?¿!¡|#]/g.exec(value);
}
export const validationMessages = {
  addressRegex:
    'El formato de este campo es inválido, no puede tener los símbolos # ° | ¿?',
};
