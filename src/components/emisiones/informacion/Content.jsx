import React from "react";
import { pure } from "recompose";

import Masknumbermoney from "../../../common/helpers/masknumbermoney/Masknumbermoney";

/**
 * @typedef {{ label: string, id: string, min: number, max: number }} Item
 */

/**
 * @type {React.ComponentType<{
 *  items: Item[],
 *  item: Item,
 *  maximum: number,
 *  getErrors: ()=> { min?: boolean, max?: boolean } | null,
 * }>}
 */
const Content = pure(
  ({
    content,
    items,
    item,
    handleChange,
    updateContent,
    removeContent,
    changeTextFile,
    maximum,
    getErrors
  }) => {
    const typeItem = content.type;
    function showName(name) {
      let s = name.split("/");
      return s[s.length - 1];
    }
    const errors = !typeItem ? false : getErrors();
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
                onChange={e => {
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
              />
              <small className="form-text d-block text-left">
                Ej: Marca, referencia, Numero IMEI, color...
              </small>
            </div>
          </div>
          <div className="col no-padding-right">
            <div className={"name form-group " + (errors ? "error" : "")}>
              <label htmlFor="name">Valor</label>
              <input
                type="text"
                className="form-control"
                name="value"
                value={content.value}
                onChange={handleChange}
                disabled={!typeItem}
              />
              <small className="form-text d-block text-left total-value">
                {`Maximo: ${
                  maximum > item.max
                    ? Masknumbermoney.formatToMask(item.max)
                    : Masknumbermoney.formatToMask(maximum)
                }`}
              </small>
              {errors && errors.min && (
                <small className="form-text only-errors show">
                  Valor Asegurado del ítem {item.label} es inferior al permitido
                </small>
              )}
              {errors && errors.max && (
                <small className="form-text only-errors show">
                  Valor Asegurado del ítem {item.label} es mayor al permitido
                </small>
              )}
            </div>
          </div>
          <div className="col no-padding-right">
            <div className="row sarlaft no-gutters">
              <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                <div className="sarlaft form-group">
                  <input
                    type="file"
                    className="form-control"
                    name="doc"
                    onChange={changeTextFile}
                  />
                  {content.showDefaultTextFile ? (
                    <p>
                      Arrastre archivos para adjuntar, o <b>buscar</b>
                    </p>
                  ) : (
                    <p>{showName(content.textFile)}</p>
                  )}
                  <span>Formatos permitidos PDF, PNG, GIF, JPG</span>
                  <br />
                  <span
                    className={
                      "error-file " +
                      (content.errorFile === true ? "show" : "hide")
                    }
                  >
                    Formato no permitido
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col col-1 text-center no-padding-left">
            <span className="trash" onClick={removeContent}>
              &nbsp;
            </span>
          </div>
        </div>
      </div>
    );
  }
);

export default Content;
