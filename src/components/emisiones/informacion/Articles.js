import React from 'react';
import positive from '../../../common/images/positive.svg';
import caution from '../../../common/images/caution.svg';
import warning from '../../../common/images/warning.svg';
import { typeItems } from '../../../common/typeItems';
import { Tooltip } from '../../Tooltip';
import Masknumbermoney from '../../../common/helpers/masknumbermoney/Masknumbermoney';

const formatToMask = (value) => {
  return Masknumbermoney.formatToMask(value);
};

export const Articles = ({
  inmuebles: {
    contenido_asegudado_valor,
    inmueble_asegudado_obrasvalor,
    inmueble_asegudado_joyasvalor,
    inmueble_asegudado_telefonosvalor,
  },
  total,
  quote_contenidomovil,
  items: itemsSelected,
  invalid,
  validateTotalItem,
}) => {
  const items = [
    [typeItems.fixedContent, contenido_asegudado_valor, total.fixedContent],
    [typeItems.jewelry, inmueble_asegudado_joyasvalor, total.jewelry],
    [typeItems.cellPhones, inmueble_asegudado_telefonosvalor, total.cellPhones],
    [
      typeItems.valuablesAndWorksOfArt,
      inmueble_asegudado_obrasvalor,
      total.valuablesAndWorksOfArt,
    ],
    [typeItems.mobileContent, quote_contenidomovil, total.mobileContent],
  ];
  /**
   * @type {{
   *  [key: string]: {
   *   label: string,
   *   state: boolean
   *  }
   * }}
   */
  const invalids = items.reduce(
    (acc, [{ id, label, required }, max, total]) => {
      acc[id] = { label, state: required && !validateTotalItem(max, total) };
      return acc;
    },
    {}
  );
  const isValid = (id) => !invalids[id].state;
  const labels = Object.values(invalids)
    .filter((value) => value.state)
    .map(({ label }) => label.toLowerCase());

  const last = labels[labels.length - 1];
  const text =
    labels.slice(0, -1).join(', ') + (labels.length > 1 ? ' y ' : '') + last;
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
              const title = `
                Aun no incluyes el 100% de la relación
                detallada de ${label}. Ten presente que
                debes completar ${maxFormated} y tienes
                ${totalFormated.replace(/\.$/g, '')} relacionados
              `;
              const contentRequired =
                required &&
                ((isValid(id) && <img src={positive} />) || (
                  <>
                    <Tooltip placement="bottom" component="span" title={title}>
                      <img className="mr-2" src={caution} />
                    </Tooltip>

                    <Tooltip placement="bottom" component="span" title={title}>
                      <img src={warning} />
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
                    <td>
                      {totalFormated} {contentRequired}
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
      {invalid && (
        <div className="col col-12">
          <div className="alert warn w-100 d-flex mt-3">
            <img className="mr-3" src={caution} />
            <div>
              <span className="text mr-4">
                Debes incluir la relación de {text}.
              </span>
              La descripción de los contenidos es necesaria para responder de
              forma efectiva
            </div>
          </div>
        </div>
      )}
      {!invalid && (
        <div className="col col-12">
          <div className="alert success w-100 d-flex mt-3">
            <img className="mr-3" src={positive} />
            <div>
              <span className="text mr-4">
                ¡Muy bien! ya incluiste la relación de contenidos móviles
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
