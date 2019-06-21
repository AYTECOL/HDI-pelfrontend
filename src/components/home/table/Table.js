import React, { Component, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import "./Table.scss";
import store from "../../../store";
import { restoreCotizacion } from "../../../actions";

import Identifications from "../../../services/GetQuote";
import Loading from "../../globals/loading/Loading";
import { UrlSite } from "../../../config";
import Pagination from "../../../common/helpers/Pagination/Pagination";

const Table = props => {
  const [quotesItems, useQuotesItems] = useState([]);
  const [pageOfItems, usePageOfItems] = useState([]);

  const initialData = dataProps => {
    // const dataTemp = [...dataProps];
    useQuotesItems(dataProps);
  };

  useEffect(() => {
    initialData(props.quotesData);
  }, [props.quotesData]);

  const onChangePage = pageOfItems => {
    usePageOfItems(pageOfItems);
  };

  const getRowById = id => async e => {
    const { history } = props;
    let cotizacion = await Identifications.getById(id);
    if (typeof cotizacion.identification !== "undefined") {
      if (cotizacion.state > 3) {
        // window.location.href =
        //   UrlSite + "/emision/" + (cotizacion.state - 3) + "/" + id;
        history.push(`${UrlSite}/emision/${cotizacion.state - 3}/${id}`);
      } else {
        // window.location.href =
        //   UrlSite + "/cotizacion/" + cotizacion.state + "/" + id;

        history.push(`${UrlSite}/cotizacion/${cotizacion.state}/${id}`);
      }
      store.dispatch(restoreCotizacion(cotizacion));
    }
  };
  const onClickOrdeArray = ({ target }) => {
    const { handleChange } = props;

    handleChange();
  };
  return (
    <div className="table-solicitudes">
      <div className="wrapper">
        <div className="row row-header">
          <div className="col">
            <span>N. de solicitud</span>
          </div>
          <div className="col">
            <span onClick={event => onClickOrdeArray(event)}>
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
        {pageOfItems.map(item => (
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
                <span>Cédula de ciudadanía</span>
              </p>
            </div>
            <div className="col">
              <p>{item.address}</p>
            </div>
            <div className="col">
              <p>{item.validity} días</p>
            </div>
            <div className="col">
              <p>Proceso de inspección</p>
            </div>
            <div className="col">
              <button
                onClick={getRowById(item.quoteId)}
                className="btn btn-default"
              >
                Retomar
              </button>
            </div>
          </div>
        ))}
      </div>
      <Pagination items={quotesItems} onChangePage={onChangePage} />
    </div>
  );
};

export default withRouter(Table);
