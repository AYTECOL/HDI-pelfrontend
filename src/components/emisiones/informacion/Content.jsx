import React from 'react';
import classNames from 'classnames';

import Masknumbermoney from 'common/helpers/masknumbermoney/Masknumbermoney';
import Helpers from 'common/helpers/helpers';
import informative from 'assets/images/informative.svg';
import { typeItems } from 'common/typeItems';
import { TYPES_VALUE_CONTENT, attachmentsItems } from './constants';

/**
 * @typedef {import('../../../models/types').Attachment} Attachment
 * @typedef {import('../../../models/types').AttachmentLocal} AttachmentLocal
 */

/**
 * @type {React.ComponentType<{
 *  items: Item[],
 *  item?: Item,
 *  maximum: number,
 *  getErrors: ()=> { min?: boolean, max?: boolean } | null,
 *  content: import('../../../models/types').GoodsOverCostLocal
 * }>}
 */
const Content = ({
  content,
  items,
  item,
  handleChange,
  updateContent,
  removeContent,
  changeTextFile,
  maximum,
  getErrors,
}) => {
  const typeItem = content.type;
  /**
   *
   * @param {Attachment | AttachmentLocal} attachment
   */
  function showName(attachment) {
    const { file } = attachment;
    if (file instanceof File) return file.name;
    else return attachment.name;
  }
  const errors = !typeItem ? false : getErrors();
  const isCellPhone = typeItems.cellPhones.id === (item && item.id);
  const canAttachFile = [
    typeItems.valuablesAndWorksOfArt.id,
    typeItems.jewelry.id,
    typeItems.mobileContent.id,
  ].includes(item && item.id);
  const { files } = content;
  const maxNumber = maximum > (item && item.max) ? item && item.max : maximum;
  const max = Masknumbermoney.formatToMask(maxNumber);
  return (
    <div className="moreitems">
      <div className="row">
        <div className="col no-padding-right">
          <div className="name form-group input-select">
            <label htmlFor="name">Tipo de item</label>
            <select
              className="form-control"
              name="type"
              id="type"
              value={typeItem}
              onChange={(e) => {
                updateContent(e);
              }}
            >
              <option value="" />
              {items.map(({ label, id }) => {
                return (
                  <option key={id} value={id}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="col no-padding-right">
          <div className="name form-group ">
            <label htmlFor="name">Características</label>
            <input
              type="text"
              className="form-control"
              name="caracte"
              value={content.caracte}
              onChange={updateContent}
              disabled={!typeItem}
              maxLength={400}
            />
            <small className="form-text d-block text-left">
              Ej: Marca, referencia, {isCellPhone && 'Numero IMEI,'} color...
              (max 400 caracteres)
            </small>
          </div>
        </div>
        <div
          className={classNames(
            'col no-padding-right',
            !canAttachFile && 'col'
          )}
        >
          <div className={'name form-group ' + (errors ? 'error' : '')}>
            <label htmlFor="name">Valor</label>
            <input
              type="text"
              className="form-control"
              name="value"
              value={Masknumbermoney.formatToMask(content.value)}
              onChange={({ target: { value } }) => {
                const numValue = value.replace(/[^0-9]/g, '');
                let newValue = numValue;
                let valueNumber = Masknumbermoney.formatToNumber(value);
                if (valueNumber > maxNumber) newValue = max;
                handleChange({
                  value: newValue,
                  type: TYPES_VALUE_CONTENT.INSURED,
                });
              }}
              disabled={!typeItem}
            />
            <small className="form-text d-block text-left total-value">
              {`Máximo: ${max} por artículo`}
            </small>
            {errors && errors.min && (
              <small className="form-text only-errors show">
                Valor Asegurado del ítem {item && item.label} es inferior al
                permitido
              </small>
            )}
            {errors && errors.max && (
              <small className="form-text only-errors show">
                Valor Asegurado del ítem {item && item.label} es mayor al
                permitido
              </small>
            )}
          </div>
        </div>
        <div
          className={classNames(
            'col no-padding-right',
            !canAttachFile && 'col'
          )}
        >
          <div className={'name form-group ' + (errors ? 'error' : '')}>
            <label htmlFor="name">Valor real</label>
            <input
              type="text"
              className="form-control"
              name="value"
              value={Masknumbermoney.formatToMask(content.real_value)}
              onChange={({ target: { value } }) => {
                const numValue = value.replace(/[^0-9]/g, '');
                handleChange({
                  value: numValue,
                  type: TYPES_VALUE_CONTENT.REAL_VALUE,
                });
              }}
              disabled={!typeItem}
            />
            {errors && errors.minRealValue && (
              <small className="form-text only-errors show">
                Valor real del ítem {item && item.label} es inferior al
                permitido
              </small>
            )}
          </div>
        </div>
        {canAttachFile && (
          <div className="col no-padding-right">
            <div className="form-group">
              <label>Factura o avaluo y fotografía</label>
              <div className="row">
                {attachmentsItems.map(
                  ({ code, className, icon, ...attachmentsItem }) => {
                    const file = files && files[code];
                    return (
                      <div
                        key={code}
                        className={classNames('col px-1', className)}
                      >
                        <div className="row sarlaft no-gutters mt-0">
                          <div className="col-12">
                            <input
                              type="file"
                              className="form-control mt-0"
                              name={code}
                              onChange={(e) => changeTextFile(e, code)}
                              accept={Helpers.fileFormats.join(', ')}
                            />
                            {!file ? (
                              <p className={icon}>{attachmentsItem.label}</p>
                            ) : (
                              <p className={icon}>{showName(file)}</p>
                            )}
                            {file && file.errorFile && (
                              <span className="error-file">
                                {file.errorFile}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
              <small className="d-flex align-items-center mt-1">
                <img className="mr-2" src={informative} alt="informative" />
                Si no adjunta documentos, debe presentarlos el día del siniestro
              </small>
            </div>
          </div>
        )}
        <div className="col col-1 text-center no-padding-left">
          <span className="trash" onClick={removeContent}>
            &nbsp;
          </span>
        </div>
      </div>
    </div>
  );
};

export default Content;
