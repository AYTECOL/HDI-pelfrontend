import Masknumbermoney from './helpers/masknumbermoney/Masknumbermoney';

export const IDS_COVERAGE_VALUES = {
  value: 1,
  contents: 2,
  valuablesAndWorksOfArt: 3,
  mobilePhones: 4,
  simpleTheft: 5,
  jewelry: 6,
  mobileContent: 7,
};
/**
 * @param {{ hired: boolean, value_show }[]} values
 */
export const getTotalCoverage = (values) => {
  return values.reduce((previousValue, { hired, value_show }) => {
    if (hired && value_show)
      return previousValue + Masknumbermoney.formatToNumber(value_show);
    return previousValue;
  }, 0);
};

/**
 *
 * @typedef {import('../services/QuoteIussedById').Coverage} Coverage
 */
/**
 * @typedef {{
 *  value: number,
 *  coverage: Coverage
 *  max?: boolean,
 *  min?: boolean,
 *  }} FormatError
 * @typedef {null | {
    max?: number,
    min?: number,
    formatError?: (params: FormatError) => string,
 *  }} Rules
 * @param {number} code  Of coverage in the iterator
 * @param {Coverage[]|undefined} coverages
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
    case 9688:
      if (coverages) {
        const hurtoCalificado = coverages.find(
          (element) => element.code_content === 9692
        );
        const values = (hurtoCalificado && hurtoCalificado.values) || [];
        const itemValue = values.find((element) => element.code === 9692);
        const value = Masknumbermoney.formatToNumber(itemValue.value_show);
        if (value)
          return {
            max: value,
            formatError: ({ max }) => {
              if (max) {
                return 'Valor Asegurado de Contenidos es superior al permitido';
              }
            },
          };
      }
      break;
    case 3017:
      return { min: 900000 };
    case 9687:
      const common = {
        min: 900000,
      };
      if (coverages) {
        const hurtoCalificado = coverages.find(
          (element) => element.code_content === 9692
        );
        const values = (hurtoCalificado && hurtoCalificado.values) || [];
        const itemValue = values.find((element) => element.code === 3017);
        const value = Masknumbermoney.formatToNumber(itemValue.value_show);
        if (value)
          return {
            max: value,
            formatError: ({ max }) => {
              if (max) {
                return 'Valor Asegurado de Contenidos es superior al permitido';
              }
            },
            ...common,
          };
      }
      return { ...common };
    default:
      return null;
  }
};
