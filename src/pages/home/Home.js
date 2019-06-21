import React, {PureComponent} from "react";
import {withRouter} from "react-router-dom";
import Counter from "../../services/Counter";
import Loading from "../../components/globals/loading/Loading";
import Table from "../../components/home/table/Table";
import "./Home.scss";
import Search from "../../components/home/search/search";
import Identifications from "../../services/GetQuote";
import MomentJs from "moment";

class Home extends PureComponent {
    state = {
        search: "",
        originalQuoteData: [],
        quotesData: [],
        parameterDays: 30,
        orderParameter: "ASC"
    };
    componentDidMount = () => {
        Loading.toggle(true);
        this.quotesDataApi();
    };
    orderByArray = event => {
        let quotesItems = this.state.quotesData;
        let arrayOrder;
        if (this.state.orderParameter === "ASC") {
            arrayOrder = quotesItems.sort((a, b) => {
                return new Date(a.create_data) - new Date(b.create_data);
            });
            this.setState({orderParameter: "DESC"});
        } else {
            arrayOrder = quotesItems.sort((a, b) => {
                return new Date(b.create_data) - new Date(a.create_data);
            });
            this.setState({orderParameter: "ASC"});
        }

        this.setState({quotesData: [...arrayOrder]});
    };
    formatDate = startDate => {
        let endDate = MomentJs.utc();
        startDate = MomentJs.utc(startDate);
        let duration = MomentJs.duration(endDate.diff(startDate));
        return (
            parseInt(this.state.parameterDays) - parseInt(duration["_data"]["days"])
        );
    };
    formatData = dataArray => {
        var dataFormat = [];
        for (let i = 0; i < dataArray.length; i++) {
            dataFormat[i] = {
                quoteId: dataArray[i].quoteId,
                create_at: MomentJs(dataArray[i].create_at).format("L"),
                hour_at: MomentJs(dataArray[i].create_at).format("LT"),
                name: `${dataArray[i].name} ${dataArray[i].last_name}`,
                address: dataArray[i].address,
                document_number: dataArray[i].document_number,
                validity: this.formatDate(dataArray[i].create_at),
                create_data: dataArray[i].create_at
            };
        }
        return dataFormat;
    };

    filterByAny = event => {
        const dataElements = this.state.originalQuoteData;
        this.transformData(dataElements, event);
    };

    transformData = (quotes = null, search = "") => {
        // const { orderBy, order: orderAsc } = this.state;
        const quotesTable = quotes ? quotes : this.state.quotesData;

        let quotesFiltered = quotesTable.slice();
        if (search) {
            quotesFiltered = quotesTable.filter(
                quoteItem =>
                    (quoteItem.name &&
                        quoteItem.name.toLowerCase().includes(search.toLowerCase())) ||
                    (quoteItem.name &&
                        quoteItem.address.toLowerCase().includes(search.toLowerCase()))
            );
        }

        const quotesTransformed = quotesFiltered.map(quote => ({
            ...quote
        }));
        // const dataSorted = sortAscArray(productsTransformed, orderBy);
        // if (orderAsc !== 'desc') {
        //   dataSorted.reverse();
        // }
        if (quotesTransformed.length > 0) {
            this.setState({quotesData: [...quotesTransformed]});
        } else {
            this.setState({quotesData: []});
        }
    };

    getNumber = async () => {
        const {history} = this.props;
        Loading.toggle(true);
        let number = await Counter.get();
        if (typeof number.currentValue !== "undefined") {
            number = number.currentValue.toString();
            history.push(`/cotizacion/1/${number}`);
        }
        setTimeout(Loading.toggle(false), 500);
    };

    quotesDataApi = async () => {
        const currentState = this;
        let {quotesData} = currentState.state;
        let arrayItems = await Identifications.get();
        arrayItems = this.formatData(arrayItems);
        quotesData = arrayItems;

        currentState.setState({quotesData, originalQuoteData: quotesData}, () =>
            Loading.toggle(false)
        );
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
                            <li>
                                <p>Cotizaciones</p> <span>12</span>
                            </li>
                            <li className="active">
                                <p>Proceso de emisión</p> <span>43</span>
                            </li>
                            <li>
                                <p>Pólizas emitidas</p> <span>12</span>
                            </li>
                        </ul>
                        <Search
                            placeholder="Busca por Nombre, Id, dirección ..."
                            handleChange={this.filterByAny}
                        />
                    </div>
                    <div className="tabs row">
                        <ul>
                            <li className="active">Ver todo</li>
                            <li>Opción 1</li>
                            <li>Opción 2</li>
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
