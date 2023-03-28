import React, { useMemo } from 'react';
import positive from 'assets/images/positive.svg';
import caution from 'assets/images/caution.svg';
import warning from 'assets/images/warning.svg';
import { isItemRequired, typeItems } from 'common/typeItems';
import { Tooltip } from '../../Tooltip';
import Masknumbermoney from 'common/helpers/masknumbermoney/Masknumbermoney';

const formatToMask = (value) => {
  return Masknumbermoney.formatToMask(value);
};

/**
 *
 * @param {string[]} texts
 * @returns
 */
const buildText = (texts) => {
  const last = texts[texts.length - 1];
  return (
    !!texts.length &&
    texts.slice(0, -1).join(', ') + (texts.length > 1 ? ' y ' : '') + last
  );
};

export const Articles = ({
  inmuebles,
  total,
  quote_contenidomovil,
  items: itemsSelected,
  invalid,
  validateTotalItem,
}) => {
  const items = useMemo(
    () => [
      [
        typeItems.fixedContent,
        inmuebles.contenido_asegudado_valor,
        total.fixedContent,
      ],
      [
        typeItems.jewelry,
        inmuebles.inmueble_asegudado_joyasvalor,
        total.jewelry,
      ],
      [
        typeItems.cellPhones,
        inmuebles.inmueble_asegudado_telefonosvalor,
        total.cellPhones,
      ],
      [
        typeItems.valuablesAndWorksOfArt,
        inmuebles.inmueble_asegudado_obrasvalor,
        total.valuablesAndWorksOfArt,
      ],
      [typeItems.mobileContent, quote_contenidomovil, total.mobileContent],
    ],
    [inmuebles, quote_contenidomovil, total]
  );
  /**
   * @type {{
   *  [key: string]: {
   *   label: string,
   *   state: boolean
   *   required: boolean
   *   total: number,
   *   max: number
   *  }
   * }}
   */
  const invalids = useMemo(
    () =>
      items.reduce((acc, [item, max, total]) => {
        const { id, label, required } = item;
        const isRequired = isItemRequired(required, { max, total });
        acc[id] = {
          label,
          state: !validateTotalItem(max, total, item),
          required: isRequired,
          total,
          max,
        };
        return acc;
      }, {}),
    [items, validateTotalItem]
  );

  const invalidsValues = useMemo(() => Object.values(invalids), [invalids]);
  const isValid = (id) => !invalids[id].state;

  const invalidsLabels = useMemo(
    () =>
      invalidsValues
        .filter((value) => value.state)
        .map(({ label }) => label.toLowerCase()),
    [invalidsValues]
  );

  const validsLabels = useMemo(
    () =>
      invalidsValues
        .filter(
          ({ required, state, total, max }) =>
            isItemRequired(required, { total, max }) && !state
        )
        .map(({ label }) => label.toLowerCase()),
    [invalidsValues]
  );

  const invalidText = buildText(invalidsLabels);
  const validText = !invalidsLabels.length && buildText(validsLabels);

  return (
    <>
      <div className="col col-12 col-sm-12 col-md-10 col-lg-8">
        <table className="table table-sm mt-4">
          <thead>
            <tr>
              <th scope="col">Tipo de articulo</th>
              <th scope="col">Valor total máximo</th>
              <th scope="col">Valor total</th>
            </tr>
          </thead>
          <tbody>
            {items.map(([{ label, id, required }, max, total]) => {
              const item = itemsSelected.find((item) => item.id === id);
              const maxFormated = formatToMask(max);
              const totalFormated = formatToMask(total);
              const cautionTitle = `
                Aun no incluyes el 100% de la relación
                detallada de ${label}. Ten presente que
                debes completar ${maxFormated} y tienes
                ${totalFormated.replace(/\.$/g, '')} relacionados
              `;
              const warnTitle = `
                Aun no incluyes la relación detallada de ${label}. 
                Ten presente que esta información es requerida para emitir la póliza.
              `;
              const contentRequired =
                isItemRequired(required, { max, total }) &&
                ((isValid(id) && <img src={positive} alt="positive" />) || (
                  <>
                    <Tooltip
                      placement="bottom"
                      component="span"
                      title={cautionTitle}
                    >
                      <img className="mr-2" src={caution} alt="caution" />
                    </Tooltip>

                    <Tooltip
                      placement="bottom"
                      component="span"
                      title={warnTitle}
                    >
                      <img src={warning} alt="warning" />
                    </Tooltip>
                  </>
                ));
              return (
                item && (
                  <tr key={id} className="h6 font-weight-normal">
                    <td className="h6 font-weight-normal font-italic">
                      {label}
                    </td>
                    <td>{maxFormated}</td>
                    <td className="d-flex align-items-center">
                      <div className="mr-2">{totalFormated}</div>
                      {contentRequired}
                    </td>
                  </tr>
                )
              );
            })}
          </tbody>
        </table>
        <div className="row row-full">
          <div className="col-auto"></div>
          <div className="col-auto"></div>
          <div className="col-auto"></div>
          <div className="col-auto"></div>
          <div className="col-auto"></div>
        </div>
      </div>
      <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
        <p className="text-center mt-3">
          Es importante conocer este tipo de artículos, esto nos permite al
          momento del siniestro responder de forma efectiva de acuerdo a la
          necesidad.{' '}
        </p>
      </div>
      {invalidText && (
        <div className="col col-12">
          <div className="alert warn w-100 d-flex mt-3">
            <img className="mr-3" src={caution} alt="caution" />
            <div>
              <span className="text mr-4">
                Debes incluir la relación de {invalidText}.
              </span>
              La descripción de los contenidos es necesaria para responder de
              forma efectiva
            </div>
          </div>
        </div>
      )}
      {validText && (
        <div className="col col-12">
          <div className="alert success w-100 d-flex mt-3">
            <img className="mr-3" src={positive} alt="positive" />
            <div>
              <span className="text mr-4">
                ¡Muy bien! ya incluiste la relación de {validText}
              </span>
              Si no adjuntaste documentos, debes presentarlos el día del
              siniestro
            </div>
          </div>
        </div>
      )}
    </>
  );
};
