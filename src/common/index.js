import Masknumbermoney from "./helpers/masknumbermoney/Masknumbermoney";

/**
 * @typedef {null | { max?:number, min?:number }} Rules
 * @param {number} code  Of coverage in the iterator
 * @param {Coverage|undefined} coverages
 * @return {Rules}
 */
export const getRulesByCode = (code, coverages = undefined) => {
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
    // Asegurado de Teléfonos Móviles
    case 9691:
      if (coverages){
        const hurtoCalificado = coverages.find(
          (element) => element.code_content === 9692
        );
        const [contentsValue, valuablesWorksArt] =
          (hurtoCalificado && hurtoCalificado.values) || [];
        if (contentsValue) {
          let value = 0;
          if (contentsValue.value_show)
            value += Masknumbermoney.formatToNumber(contentsValue.value_show);
          if (valuablesWorksArt.value_show)
            value += Masknumbermoney.formatToNumber(
              valuablesWorksArt.value_show
            );
          if (value)
            return {
              max: value,
            };
        }
      }
      break;
    default:
      return null;
  }
};
