import React from 'react';
import Masknumbermoney from '../../../../common/helpers/masknumbermoney/Masknumbermoney';
import styles from './LastContentWarn.module.scss';
import caution from '../../../../common/images/caution.svg';
import { isItemRequired } from '../../../../common/typeItems';

/**
 *
 * @param {{
 *   getItem: (type: string) => import('../../../../models/types').Item
 * }} param0
 * @returns
 */
export const LastContentWarn = ({
  content,
  totalByType,
  validateTotalItem,
  getItem,
}) => {
  if (!content) return null;
  const item = getItem(content.type);
  const limit = item.maxTotal;
  const total = totalByType[content.type];
  if (
    !limit ||
    !isItemRequired(item.required, total) ||
    validateTotalItem(limit, total)
  )
    return null;
  return (
    <div className={styles.root}>
      <img className="mr-2" src={caution} />
      Debes agregar más contenidos hasta que completes{' '}
      {Masknumbermoney.formatToMask(limit)}
    </div>
  );
};
