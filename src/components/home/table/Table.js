import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import './Table.scss';
import store from '../../../store';
import { restoreCotizacion } from '../../../actions';
import PdfPolizaHogar from '../../../services/PdfPolizaHogar';
import PolizaAnexoHogar from '../../../services/PolizaAnexoHogar';
import GetQuote from '../../../services/GetQuote';
import Identifications from '../../../services/Identifications';
import { UrlSite } from '../../../config';
import Pagination from '../../../common/helpers/Pagination/Pagination';
import Loading from '../../../components/globals/loading/Loading';

/**
 *  @typedef {{ type_person: string, description: string, code: number }} IdentificationType
 */
const Table = (props) => {
  const [quotesItems, useQuotesItems] = useState([]);
  const [pageOfItems, usePageOfItems] = useState([]);
  /**
   * @type {[IdentificationType[], React.Dispatch<React.SetStateAction<IdentificationType[]>>]}
   */
  const [identificationTypes, setIdentificationTypes] = useState([]);

  useEffect(() => {
    Identifications.get()
      .then(({ identifications }) => identifications)
      .catch(() => [])
      .then((data) => {
        setIdentificationTypes(data);
      });
  }, []);
  useEffect(() => {
    initialData(props.quotesData);
  });
  const initialData = (dataProps) => {
    // const dataTemp = [...dataProps];
    useQuotesItems(dataProps);
  };

  useEffect(() => {
    initialData(props.quotesData);
  });

  const onChangePage = (pageOfItems) => {
    usePageOfItems(pageOfItems);
  };

  const getRowById = (id) => async (e) => {
    const { history } = props;
    let cotizacion = await GetQuote.getById(id);
    if (typeof cotizacion.identification !== 'undefined') {
      if (cotizacion.state <= 3) {
        history.push(`${UrlSite}/cotizacion/${cotizacion.state}/${id}`);
      } else if (cotizacion.state < 7 && cotizacion.state > 3) {
        history.push(`${UrlSite}/emision/${cotizacion.state - 3}/${id}`);
      } else {
        history.push(
          `${UrlSite}/exito/${id}/${cotizacion.identification.emissionId}`
        );
      }
      store.dispatch(restoreCotizacion(cotizacion));
    }
  };
  const getPdf = (id) => async (e) => {
    Loading.toggle(true);
    try {
      let a = document.createElement('a');

      let pdf = await PdfPolizaHogar.get(id);
      a = document.createElement('a');
      a.style.display = 'none';
      document.body.appendChild(a);
      a.href = 'data:application/pdf;base64,' + pdf;
      a.setAttribute('download', 'PdfPolizaPrima.pdf');
      a.click();
      document.body.removeChild(a);

      let pdfAnexo = await PolizaAnexoHogar.get(id);
      a.style.display = 'none';
      document.body.appendChild(a);
      a.href = 'data:application/pdf;base64,' + pdfAnexo;
      a.setAttribute('download', 'PolizaAnexoHogar.pdf');
      a.click();
      document.body.removeChild(a);

      Loading.toggle(false);
    } catch (e) {
      Loading.toggle(false);
    }
  };
  const onClickOrdeArray = (typeFilter) => {
    const { handleChange } = props;

    handleChange(typeFilter);
  };
  return (
    <div className="table-solicitudes">
      <div className="wrapper">
        <div className="row row-header">
          <div className="col">
            <span onClick={(event) => onClickOrdeArray('quoteId')}>
              N. de solicitud<i className="tagTable">&#8597;</i>
            </span>
          </div>
          <div className="col">
            <span onClick={(event) => onClickOrdeArray('date')}>
              Fecha
              <i className="tagTable">&#8597;</i>
            </span>
          </div>
          <div className="col">
            <span>Tomador</span>
          </div>
          <div className="col">
            <span>Identificación</span>
          </div>
          <div className="col">
            <span>Dirección</span>
          </div>
          <div className="col">
            <span>Validez</span>
          </div>
          <div className="col">
            <span>Estado</span>
          </div>
          <div className="col">
            <span>Acción</span>
          </div>
        </div>
        {pageOfItems.map((item) => {
          const identificationType = (identificationTypes || []).find(
            ({ code }) => String(item.document_type) === String(code)
          );
          return (
            <div className="row body" key={item.quoteId}>
              <div className="col">
                <p>{item.quoteId}</p>
              </div>
              <div className="col">
                <p>
                  {item.create_at} <span>{item.hour_at}</span>
                </p>
              </div>
              <div className="col">
                <p>{item.name}</p>
              </div>
              <div className="col">
                <p>
                  {item.document_number}
                  <span>
                    {(identificationType && identificationType.description) ||
                      'Cédula de ciudadanía'}
                  </span>
                </p>
              </div>
              <div className="col">
                <p>
                  {'addressHome' in item.pdf_info
                    ? item.pdf_info.addressHome
                    : item.address}
                </p>
              </div>
              <div className="col">
                <p>{item.validity} días</p>
              </div>
              <div className="col">
                <p>{item.stateQuote}</p>
              </div>
              <div className="col">
                {item.step !== 7 && (
                  <button
                    onClick={getRowById(item.quoteId)}
                    className="btn btn-default"
                  >
                    {' '}
                    Retomar
                  </button>
                )}
                {item.step === 7 && (
                  <button
                    onClick={getPdf(item.quoteId)}
                    className="btn btn-default"
                  >
                    {' '}
                    Descargar PDF
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <Pagination items={quotesItems} onChangePage={onChangePage} />
    </div>
  );
};

export default withRouter(Table);
