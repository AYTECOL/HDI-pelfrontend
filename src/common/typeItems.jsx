// @ts-check

/**
 * @typedef {{
 *  total: number,
 *  max: number,
 * }} RequiredParam
 */

/**
 * @typedef {import("../models/types").ItemRequired} ItemRequired
 */

/**
 * @typedef {{ id: number; label: string; max: number; required?: ItemRequired }} TypeItem
 */

export const itemsRequiredSince = {
  fixedContent: 12000000,
  valuablesAndWorksOfArt: 2000000,
};

/**
 * @type {Record<string, TypeItem>}
 */
export const typeItems = {
  /**
   * @description "Contenido Fijo"
   **/
  fixedContent: {
    id: 0,
    label: 'Contenido Fijo',
    max: 50000000,
    required({ max }) {
      return max >= itemsRequiredSince.fixedContent;
    },
  },
  /**
   * @description "Objetos de valor y obras de Arte"
   **/
  valuablesAndWorksOfArt: {
    id: 1,
    label: 'Objetos de valor y obras de Arte',
    max: 20000000,
    required({ max }) {
      return max >= itemsRequiredSince.valuablesAndWorksOfArt;
    },
  },
  /**
   * @description "Joyas"
   **/
  jewelry: { id: 2, label: 'Joyas', max: 20000000, required: true },
  /**
   * @description "Celulares"
   **/
  cellPhones: { id: 3, label: 'Celulares', max: 4000000, required: true },
  /**
   * @description "Contenido Movil"
   **/
  mobileContent: {
    id: 4,
    label: 'Contenido Movil',
    max: 20000000,
    required: true,
  },
};

/**
 *
 * @param {ItemRequired} required
 * @param {RequiredParam} params
 */
export const isItemRequired = (required, params) => {
  if (!required) return true;
  if (typeof required === 'function') return required(params);
  return required;
};

export const getTypeItem = (id) =>
  Object.values(typeItems).find((item) => +item.id === +id);
