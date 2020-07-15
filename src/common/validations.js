export function isValidDirection(value) {
  return !/[°?¿!¡|#]|^(?!.{5,}).*/g.exec(value);
}
export const validationMessages = {
  addressRegex:
    'El formato de este campo es inválido, no puede tener los símbolos # ° | ¿?',
};
