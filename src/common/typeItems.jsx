/**
 * @typedef {{ id: number; label: string; max: number; required?: boolean }} TypeItem
 */
export const typeItems = {
  /**
   * @description "Contenido Fijo"
   **/
  fixedContent: {
    id: 0,
    label: 'Contenido Fijo',
    max: 50000000,
  },
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
