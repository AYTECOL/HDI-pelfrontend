import React from 'react';
// @ts-check
/**
 * @typedef {import("../../../models/types").TypeAttachments} TypeAttachments
 * */

/**
 * @type {Record<TypeAttachments, TypeAttachments>}
 */
export const typeAttachments = {
  bill: 'bill',
  photo: 'photo',
};

/**
 * @type {{
 *  code: import('../../../models/types').TypeAttachments;
 *  label: React.ReactNode;
 *  className: string;
 *  icon?: string;
 * }[]}
 */
export const attachmentsItems = [
  {
    code: typeAttachments.bill,
    label: (
      <React.Fragment>
        Arrastre archivos para adjuntar, o <b>buscar</b>
      </React.Fragment>
    ),
    className: 'col-7',
    icon: '',
  },
  {
    code: typeAttachments.photo,
    className: 'col-5',
    label: <React.Fragment>Adjuntar foto</React.Fragment>,
    icon: 'photo',
  },
];
