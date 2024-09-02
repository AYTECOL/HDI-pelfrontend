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
 * @typedef {{ id: number; }} TypeItem
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
  fixedContent: { id: 0 },
  /**
   * @description "Objetos de valor y obras de Arte"
   **/
  valuablesAndWorksOfArt: { id: 1 },
  /**
   * @description "Joyas"
   **/
  jewelry: { id: 2 },
  /**
   * @description "Celulares"
   **/
  cellPhones: { id: 3 },
  /**
   * @description "Contenido Movil"
   **/
  mobileContent: { id: 4 },
};

/**
 *
 * @param {ItemRequired} required
 * @param {RequiredParam} params
 */
export const isItemRequired = (required, params) => {
  if (typeof required === 'boolean') return required;
  if (typeof required === 'function') return required(params);
  return false;
};

export const getTypeItem = (id) =>
  Object.values(typeItems).find((item) => +item.id === +id);
