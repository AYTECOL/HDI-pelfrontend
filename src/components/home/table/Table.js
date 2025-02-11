import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import './Table.scss';
import store from 'store';
import { restoreCotizacion } from '../../../store/actions';
import PdfPolizaHogar from '../../../services/PdfPolizaHogar';
import GetQuote from '../../../services/GetQuote';
import GetEstate from '../../../services/GetEstate';
import Identifications from '../../../services/Identifications';
import { UrlSite } from '../../../config';
import Pagination from '../../../common/helpers/Pagination/Pagination';
import Loading from '../../../components/globals/loading/Loading';
import QuoteIussedById from '../../../services/QuoteIussedById';
import PdfEndosoHogar from '../../../services/PdfEndosoHogar';
import Quotes from 'services/GetQuote';
import CreateAuditData from 'services/Audit';
import Masknumbermoney from 'common/helpers/masknumbermoney/Masknumbermoney';
import Helpers from 'common/helpers/helpers';
import MomentJs from 'moment';
import { MONTHS } from 'assets/constants';

import arrow from '../../../assets/images/arrow_down.svg';

/**
 *  @typedef {{ type_person: string, description: string, code: number }} IdentificationType
 */
const Table = (props) => {
  const [quotesItems, setQuotesItems] = useState([]);
  const [pageOfItems, setPageOfItems] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [plans, setPlans] = useState(new Map());
  const [moreInfo, setMoreInfo] = useState(new Map());
  const identificationTypes = store.getState().identifications;
  const {
    agente: intermediateCode,
    usuario,
    Celular,
    nombreUsuario,
    Sucursal,
  } = store.getState().auth || {};

  useEffect(() => {
    initialData(props.quotesData);
  });
  const initialData = (dataProps) => {
    // const dataTemp = [...dataProps];
    setQuotesItems(dataProps);
  };

  useEffect(() => {
    initialData(props.quotesData);
  });

  const onChangePage = (pageOfItems) => {
    setPageOfItems(pageOfItems);
  };

  const getRowById = (id) => async (e) => {
    const { history } = props;
    await GetEstate.get(id);
    let cotizacion = await GetQuote.getById(id);
    let body = {
      opcion: 'Dashboard link cotizaciones / retomar',
      respuesta: [],
      respuesta_identificación: [],
      campo_filtro: '',
      clave_broker: intermediateCode,
      username: usuario,
      celular: Celular,
      nombreIntermediario: nombreUsuario,
      sucursal: Sucursal,
      identificacion: cotizacion.identification.value,
    };
    await CreateAuditData.createDataAudit(body);
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
      console.log('cotizacion', cotizacion);
    }
  };
  const getPdf = (id) => async (e) => {
    Loading.toggle(true);
    try {
      let a = document.createElement('a');
      let data = await QuoteIussedById.get(id);
      let endoso = false;
      if (typeof data.quote_iussed_info !== 'undefined') {
        if (
          typeof data.quote_iussed_info.Item !== 'undefined' &&
          typeof data.quote_iussed_info.Item.onerous !== 'undefined'
        ) {
          if (data.quote_iussed_info.Item.onerous.length > 0) {
            endoso = true;
          }
        }
      }

      if (endoso) {
        let pdfEndoso = await PdfEndosoHogar.get(id);

        let a = document.createElement('a');
        a.style.display = 'none';
        document.body.appendChild(a);
        a.href = 'data:application/pdf;base64,' + pdfEndoso;
        a.setAttribute('download', 'BeneficiarioOnerosoHogar.pdf');
        a.click();
        document.body.removeChild(a);
      }
      let pdf = await PdfPolizaHogar.get(id);
      a = document.createElement('a');
      a.style.display = 'none';
      document.body.appendChild(a);
      a.href = 'data:application/pdf;base64,' + pdf;
      a.setAttribute('download', 'PdfPolizaPrima.pdf');
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
  const isEmitted = pageOfItems.some((item) => item.step === 7);
  useEffect(() => {
    async function getPlanSelected() {
      setLoadingPlans(true);
      const ids = pageOfItems.map(({ quoteId }) => quoteId);

      if (isEmitted) {
        const { moreInfo: newMoreInfo } = await Quotes.getMoreInfoPolicies(ids);
        setMoreInfo(new Map(newMoreInfo.map((more) => [more.id, more])));
      } else {
        const { plans: newPlans } = await Quotes.getPlanSelected(ids);
        setPlans(new Map(newPlans.map((plan) => [plan?.id || 0, plan])));
      }
    }
    if (pageOfItems.length)
      getPlanSelected().finally(() => setLoadingPlans(false));
  }, [pageOfItems]);

  const getStartDateValidityPolicy = (date) => {
    const dateString = date.replace('º', '').split(' ');
    dateString[1] = (MONTHS.indexOf(dateString[1]) + 1).toString();
    return new Date(`${dateString[1]} ${dateString[2]} ${dateString[3]}`);
  };

  return (
    <div className="table-solicitudes">
      <div className="wrapper">
        <div className="row row-header">
          <div className="col">
            <span onClick={(event) => onClickOrdeArray('quoteId')}>
              {isEmitted ? 'No. de póliza' : 'N. de solicitud'}{' '}
              <i className="tagTable">
                <img src={arrow} alt="" />
              </i>
            </span>
          </div>
          <div className="col">
            <span onClick={(event) => onClickOrdeArray('date')}>
              {isEmitted ? 'Fecha de emisión' : 'Fecha'}{' '}
              <img src={arrow} alt="" />
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
            <span>{isEmitted ? 'Fecha de inicio de vigencia' : 'Validez'}</span>
          </div>
          <div className="col">
            <span>Prima total</span>
          </div>
          <div className="col">
            <span>Acción</span>
          </div>
        </div>
        {pageOfItems.map((item, index) => {
          const {
            quoteId,
            create_at,
            hour_at,
            name,
            document_number,
            document_type,
            address,
            pdf_info,
            validity,
            step,
            emissionId,
            emitedDate,
            hourEmitedDate,
          } = item;
          const identificationType = (identificationTypes || []).find(
            ({ code }) => String(document_type) === String(code)
          );
          const plan = plans.get(quoteId);
          const info = moreInfo.get(quoteId);
          const validityDate = getStartDateValidityPolicy(
            info?.start_policy_date || ''
          );
          return (
            <div key={`page-items-${index}`}>
              <div className="row body" key={quoteId}>
                <div className="col">
                  <p>{isEmitted ? emissionId : quoteId}</p>
                </div>
                <div className="col">
                  <p>
                    {isEmitted ? emitedDate : create_at}
                    <span>{isEmitted ? hourEmitedDate : hour_at}</span>
                  </p>
                </div>
                <div className="col">
                  <p>{name}</p>
                </div>
                <div className="col">
                  <p>
                    {document_number}
                    <span>
                      {(identificationType && identificationType.description) ||
                        'Cédula de ciudadanía'}
                    </span>
                  </p>
                </div>
                <div className="col col-address">
                  <p>
                    {address?.toLowerCase() || ''}
                    <br />
                    <span>
                      {Helpers.capitalize(pdf_info?.department || '')}-
                      {Helpers.capitalize(pdf_info?.city || '')}
                    </span>
                  </p>
                </div>
                <div className="col">
                  {isEmitted ? (
                    loadingPlans ? (
                      <div className="d-block text-center mt-1">
                        <div
                          className="spinner-border tab-loading"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <p>{MomentJs(validityDate).format('L')}</p>
                    )
                  ) : (
                    <p>{validity} días</p>
                  )}
                </div>
                <div className="col col-address">
                  {loadingPlans ? (
                    <div className="d-block text-center mt-1">
                      <div className="spinner-border tab-loading" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <p>
                      {Masknumbermoney.formatToMask(plan?.prospect || 0)}
                      <br />
                      <span>Plan {Helpers.capitalize(plan?.name || '')}</span>
                    </p>
                  )}
                </div>
                <div className="col">
                  {step !== 7 && validity > 0 && (
                    <button
                      onClick={getRowById(item.quoteId)}
                      className="btn btn-default btn-default--two"
                    >
                      {' '}
                      Retomar
                    </button>
                  )}
                  {step === 7 && (
                    <button
                      onClick={getPdf(item.quoteId)}
                      className="btn btn-default btn-default--two"
                    >
                      {' '}
                      Descargar PDF
                    </button>
                  )}
                </div>
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
