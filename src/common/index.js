/**
 * @typedef {null | { max?:number, min?:number }} Rules
 * @param {number} code  Of coverage in the iterator
 * @return {Rules}
 */
export const getRulesByCode = (code) => {
  switch (code) {
    // Asegurado de Contenidos Móviles
    case 3044:
      return {
        max: 50000000,
        min: 900000,
      };
    // Asegurado de Joyas
    case 3045:
      return {
        max: 50000000,
        min: 900000,
      };
    // Asegurado de Teléfonos Móviles
    case 9652:
      return {
        max: 10000000,
        min: 850000,
      };
    default:
      return null;
  }
};
