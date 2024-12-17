import React, { useEffect, useMemo, useState } from 'react';
import { withRouter } from 'react-router-dom';
import Counter from 'services/Counter';
import Loading from 'components/globals/loading/Loading';
import Table from 'components/home/table/Table';
import './Home.scss';
import Search from 'components/home/search/search';
import Quotes from 'services/GetQuote';
import MomentJs from 'moment';
import {
  STEP_EMITTED,
  STEP_ISSUE,
  STEP_QUOTATION,
  STATUS,
  VALIDITY_QUOTES_DAYS,
} from 'assets/constants';
import store from 'store';

const Home = (props) => {
  const [quotesData, setQuotesData] = useState([]);
  const [filter, setFilter] = useState({
    orderBy: {
      type: 'DESC',
      key: null,
    },
    search: null,
  });
  const [stepTable, setStepTable] = useState(STEP_QUOTATION);
  const [statesQuotes, setStatesQuotes] = useState({});
  const { agente: intermediateCode } = store.getState().auth;

  /**
   * @param {import("services/GetQuote").PolicyRequest[]} dataArray
   */
  const formatDataQuotations = (dataArray) => {
    /**
     *
     * @param {string} text
     */
    const cleanQuotes = (text) => text.replace('""', '');
    let quotation = 0,
      issue = 0,
      emitted = 0;
    let dataFormat = dataArray.map((item) => {
      const quote = {
        quoteId: item.quoteId,
        create_at: MomentJs(item.create_at).format('L'),
        hour_at: MomentJs(item.create_at).format('LT'),
        name:
          cleanQuotes(item.business_name) || `${item.name} ${item.last_name}`,
        address: item.address,
        document_number: item.document_number,
        document_type: item.document_type,
        validity: getValidity(item.create_at),
        create_data: item.create_at,
        stateQuote: item.status,
        step: item.step,
        pdf_info: item.pdf_info,
        emissionId: item.policy?.emissionId || null,
        emitedDate: item.policy?.emitedDate
          ? MomentJs(item.policy.emitedDate).format('L')
          : null,
        hourEmitedDate: item.policy?.emitedDate
          ? MomentJs(item.policy?.emitedDate).format('LT')
          : null,
      };
      if (quote.stateQuote === STATUS.QUOTATION && quote.validity > 0)
        quotation += 1;
      if (quote.stateQuote === STATUS.PROCESS_IN_EMISSION && quote.validity > 0)
        issue += 1;
      if (quote.stateQuote === STATUS.EMITTED) emitted += +1;
      return quote;
    });
    setStatesQuotes({ ...statesQuotes, quotation, issue, emitted });
    return dataFormat;
  };

  const getValidity = (startDate) => {
    const endDate = MomentJs.utc();
    startDate = MomentJs.utc(startDate).hour(0);
    const days = startDate.diff(endDate, 'days');
    return VALIDITY_QUOTES_DAYS - Math.abs(days);
  };

  const getNumber = async () => {
    const { history } = props;
    Loading.toggle(true);
    let number = await Counter.get();
    if ('currentValue' in number) {
      number = number.currentValue.toString();
      history.push(`/cotizacion/1/${number}`);
    }
    setTimeout(Loading.toggle(false), 500);
  };

  useEffect(() => {
    async function getQuotes() {
      Loading.toggle(true);
      let arrayItems = await Quotes.get(intermediateCode);
      const result = formatDataQuotations(arrayItems);
      setQuotesData(result);
      Loading.toggle(false);
    }
    if (intermediateCode) getQuotes();
  }, [intermediateCode]);

  const quoteFilters = useMemo(() => {
    const { orderBy, search } = filter;
    let filterQuotes = quotesData;
    if (orderBy.type === 'ASC') {
      const filterType = orderBy?.key === 'date' ? 'create_data' : 'quoteId';
      const result = quotesData.sort((a, b) => {
        const condition =
          orderBy?.key === 'date'
            ? new Date(a[filterType]) - new Date(b[filterType])
            : parseInt(a[filterType]) - parseInt(b[filterType]);
        return condition;
      });
      filterQuotes = [...result];
    } else if (orderBy.type === 'DESC') {
      const filterType = orderBy?.key === 'date' ? 'create_data' : 'quoteId';
      const result = quotesData.sort((a, b) => {
        const condition =
          orderBy?.key === 'date'
            ? new Date(b[filterType]) - new Date(a[filterType])
            : parseInt(b[filterType]) - parseInt(a[filterType]);
        return condition;
      });
      filterQuotes = [...result];
    }

    if (search) {
      const result = filterQuotes.filter(
        (quoteItem) =>
          (quoteItem.name &&
            quoteItem.name.toLowerCase().includes(search.toLowerCase())) ||
          (quoteItem.name &&
            quoteItem.address.toLowerCase().includes(search.toLowerCase())) ||
          (quoteItem.document_number &&
            quoteItem.document_number
              .toLowerCase()
              .includes(search.toLowerCase()))
      );

      filterQuotes = [...result];
    }

    filterQuotes = [
      ...filterQuotes.filter(({ step }) => stepTable.includes(step)),
    ];
    return [
      ...filterQuotes.filter(
        ({ validity, step }) => step !== 7 && validity > 0
      ),
      ...filterQuotes.filter(({ step }) => step === 7),
    ];
  }, [quotesData, filter, stepTable]);

  return (
    <div className="home">
      <div className="container">
        <div className="row">
          <div className="col col-sm-12 col-md-12 col-lg-12 title">
            <h2>Mis negocios en línea</h2>
            <button
              type="button"
              className="btn btn-primary btn-home"
              onClick={getNumber}
            >
              Nueva cotización
            </button>
          </div>
        </div>
        <div className="top-bar">
          <ul className="menus">
            <li
              onClick={() => setStepTable(STEP_QUOTATION)}
              className={
                stepTable.includes(STEP_QUOTATION[0])
                  ? 'active_item_dashboard'
                  : ''
              }
            >
              <p>Cotizaciones</p> <span>{statesQuotes.quotation}</span>
            </li>
            <li
              onClick={() => setStepTable(STEP_ISSUE)}
              className={
                stepTable.includes(STEP_ISSUE[0]) ? 'active_item_dashboard' : ''
              }
            >
              <p>Proceso de emisión</p> <span>{statesQuotes.issue}</span>
            </li>
            <li
              onClick={() => setStepTable(STEP_EMITTED)}
              className={
                stepTable.includes(STEP_EMITTED[0])
                  ? 'active_item_dashboard'
                  : ''
              }
            >
              <p>Pólizas emitidas</p> <span>{statesQuotes.emitted}</span>
            </li>
          </ul>
          <Search
            placeholder="Busca por Nombre, Id, dirección ..."
            handleChange={(value) => setFilter({ ...filter, search: value })}
          />
        </div>
        <Table
          quotesData={quoteFilters}
          handleChange={(key) =>
            setFilter({
              ...filter,
              orderBy: {
                key,
                type: filter.orderBy.type === 'DESC' ? 'ASC' : 'DESC',
              },
            })
          }
          filter={filter}
        />
      </div>
    </div>
  );
};
export default withRouter(Home);
