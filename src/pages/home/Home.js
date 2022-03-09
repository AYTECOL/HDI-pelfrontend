import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import Counter from '../../services/Counter';
import Loading from '../../components/globals/loading/Loading';
import Table from '../../components/home/table/Table';
import './Home.scss';
import Search from '../../components/home/search/search';
import Quotes from '../../services/GetQuote';
import MomentJs from 'moment';
import {
  STEP_EMITTED,
  STEP_ISSUE,
  STEP_QUOTATION,
} from '../../common/constants/quotesStates';

class Home extends PureComponent {
  state = {
    search: '',
    originalQuoteData: [],
    quotesData: [],
    parameterDays: 30,
    orderParameter: 'ASC',
    statesQuotes: [],
  };
  componentDidMount = () => {
    Loading.toggle(true);
    this.quotesDataApi();
  };
  orderByArray = (typeFilter) => {
    let quotesItems = this.state.quotesData;
    let arrayOrder;
    if (typeFilter === 'date') {
      if (this.state.orderParameter === 'ASC') {
        arrayOrder = quotesItems.sort((a, b) => {
          return new Date(a.create_data) - new Date(b.create_data);
        });
        this.setState({ orderParameter: 'DESC' });
      } else {
        arrayOrder = quotesItems.sort((a, b) => {
          return new Date(b.create_data) - new Date(a.create_data);
        });
        this.setState({ orderParameter: 'ASC' });
      }
    }
    if (typeFilter === 'quoteId') {
      if (this.state.orderParameter === 'ASC') {
        arrayOrder = quotesItems.sort((a, b) => {
          return parseInt(a.quoteId) - parseInt(b.quoteId);
        });
        this.setState({ orderParameter: 'DESC' });
      } else {
        arrayOrder = quotesItems.sort((a, b) => {
          return parseInt(b.quoteId) - parseInt(a.quoteId);
        });
        this.setState({ orderParameter: 'ASC' });
      }
    }

    this.setState({ quotesData: [...arrayOrder] });
  };
  formatDate = (startDate) => {
    let endDate = MomentJs.utc();
    startDate = MomentJs.utc(startDate);
    let duration = MomentJs.duration(endDate.diff(startDate));
    return (
      parseInt(this.state.parameterDays) - parseInt(duration['_data']['days'])
    );
  };
  formatStatesQuotes = (step) => {
    let stringState = '';
    if (step === 1 || step === 2 || step === 3) {
      stringState = 'Cotización';
    } else if (step === 4 || step === 5 || step === 6) {
      stringState = 'Proceso de emisión';
    } else if (step === 7) {
      stringState = 'Póliza emitida';
    }

    return stringState;
  };

  /**
   * @param {import("../../services/GetQuote").PolicyRequest[]} dataArray
   */
  formatData = (dataArray) => {
    /**
     *
     * @param {string} text
     */
    const cleanQuotes = (text) => text.replace('""', '');
    const dataFormat = dataArray.map((item) => ({
      quoteId: item.quoteId,
      create_at: MomentJs(item.create_at).format('L'),
      hour_at: MomentJs(item.create_at).format('LT'),
      name: cleanQuotes(item.business_name) || `${item.name} ${item.last_name}`,
      address: item.address,
      document_number: item.document_number,
      document_type: item.document_type,
      validity: this.formatDate(item.create_at),
      create_data: item.create_at,
      stateQuote: this.formatStatesQuotes(item.step),
      step: item.step,
      pdf_info: item.pdf_info,
    }));
    this.setState((prevState) => ({
      statesQuotes: {
        ...prevState.statesQuotes,
        quotation: dataArray.filter(
          (data) => data.step === 1 || data.step === 2 || data.step === 3
        ).length,
      },
    }));
    this.setState((prevState) => ({
      statesQuotes: {
        ...prevState.statesQuotes,
        issue: dataArray.filter(
          (data) => data.step === 4 || data.step === 5 || data.step === 6
        ).length,
      },
    }));
    this.setState((prevState) => ({
      statesQuotes: {
        ...prevState.statesQuotes,
        emitted: dataArray.filter((data) => data.step === 7).length,
      },
    }));
    return dataFormat;
  };

  filterByAny = (event) => {
    const dataElements = this.state.originalQuoteData;
    this.transformData(dataElements, event);
  };
  onClickStateQuote = (stateQuote) => {
    let dataArrayState = this.state.originalQuoteData;
    let dataFortmated = dataArrayState.filter((data) =>
      stateQuote.includes(data.step)
    );

    this.setState({ quotesData: [...dataFortmated] });
  };
  transformData = (quotes = null, search = '') => {
    // const { orderBy, order: orderAsc } = this.state;
    const quotesTable = quotes ? quotes : this.state.quotesData;

    let quotesFiltered = quotesTable.slice();
    if (search) {
      quotesFiltered = quotesTable.filter(
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
    }

    const quotesTransformed = quotesFiltered.map((quote) => ({
      ...quote,
    }));
    // const dataSorted = sortAscArray(productsTransformed, orderBy);
    // if (orderAsc !== 'desc') {
    //   dataSorted.reverse();
    // }
    if (quotesTransformed.length > 0) {
      this.setState({ quotesData: [...quotesTransformed] });
    } else {
      this.setState({ quotesData: [] });
    }
  };

  getNumber = async () => {
    const { history } = this.props;
    Loading.toggle(true);
    let number = await Counter.get();
    if (typeof number.currentValue !== 'undefined') {
      number = number.currentValue.toString();
      history.push(`/cotizacion/1/${number}`);
    }
    setTimeout(Loading.toggle(false), 500);
  };

  quotesDataApi = async () => {
    const currentState = this;
    let { quotesData } = currentState.state;
    let arrayItems = await Quotes.get();
    arrayItems = this.formatData(arrayItems);
    quotesData = arrayItems;

    currentState.setState({ quotesData, originalQuoteData: quotesData }, () =>
      Loading.toggle(false)
    );
  };
  getAllData = (event) => {
    this.setState({ quotesData: this.state.originalQuoteData });
  };

  render() {
    return (
      <div className="home">
        <div className="container">
          <div className="row">
            <div className="col col-sm-12 col-md-12 col-lg-12 title">
              <h2>Mis Negocios en línea</h2>
              <button
                type="button"
                className="btn btn-primary btn-home"
                onClick={this.getNumber}
              >
                Nueva cotización
              </button>
            </div>
          </div>
          <div className="top-bar">
            <ul className="menus">
              <li onClick={(event) => this.onClickStateQuote(STEP_QUOTATION)}>
                <p>Cotizaciones</p>{' '}
                <span>{this.state.statesQuotes.quotation}</span>
              </li>
              <li onClick={(event) => this.onClickStateQuote(STEP_ISSUE)}>
                <p>Proceso de emisión</p>{' '}
                <span>{this.state.statesQuotes.issue}</span>
              </li>
              <li onClick={(event) => this.onClickStateQuote(STEP_EMITTED)}>
                <p>Pólizas emitidas</p>{' '}
                <span>{this.state.statesQuotes.emitted}</span>
              </li>
            </ul>
            <Search
              placeholder="Busca por Nombre, Id, dirección ..."
              handleChange={this.filterByAny}
            />
          </div>
          <div className="tabs row">
            <ul>
              <li onClick={(event) => this.getAllData()}>Ver todo</li>
            </ul>
          </div>
          <Table
            quotesData={this.state.quotesData}
            handleChange={this.orderByArray}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
