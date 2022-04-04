/**
 * @typedef {{ id: number; label: string; max: number; }} TypeItem
 */
export const typeItems = {
  /**
   * @description "Contenido Fijo"
   **/
  fixedContent: { id: 0, label: 'Contenido Fijo', max: 50000000 },
  /**
   * @description "Objetos de valor y obras de Arte"
   **/
  valuablesAndWorksOfArt: {
    id: 1,
    label: 'Objetos de valor y obras de Arte',
    max: 20000000,
  },
  /**
   * @description "Joyas"
   **/
  jewelry: { id: 2, label: 'Joyas', max: 20000000 },
  /**
   * @description "Celulares"
   **/
  cellPhones: { id: 3, label: 'Celulares', max: 4000000 },
  /**
   * @description "Contenido Movil"
   **/
  mobileContent: { id: 4, label: 'Contenido Movil', max: 20000000 },
};
