import React, {Component} from 'react';
import './Home.scss';
import Counter from "../../services/Counter";
import store from "../../store";
import {saveCotizacionNumber} from "../../actions";

import Table from '../../components/home/table/Table';

class Home extends Component {

    getNumber = async () => {
        let storeState = store.getState();
        let number = await Counter.get();
        if (typeof number.currentValue !== 'undefined') {
            number = number.currentValue.toString();
            number = storeState.cotizacion.number.slice(number.length) + number;
            store.dispatch(saveCotizacionNumber(number));
            this.props.history.push('/cotizacion/1/' + number);
        } else {
            this.props.history.push('/');
        }
    };

    render() {
        return (
            <div className="home">
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 title">
                            <h2>Mis negocios en línea</h2>
                            <button type="button" className="btn btn-primary btn-home"
                                    onClick={this.getNumber}>Nueva
                                cotización
                            </button>
                        </div>
                    </div>

                    <div className="top-bar">
                        <ul className="menus">
                            <li>Cotizaciones <span>12</span></li>
                            <li className="active">Proceso de emisión <span>43</span></li>
                            <li>Pólizas emitidas <span>12</span></li>
                        </ul>
                        <div className="search">
                            <div className={"form-group input-select"}>
                                <select name="code" id="doc-type"
                                        className={"form-control"}>
                                    <option value="">Seleciona</option>
                                </select>
                            </div>
                            <div className={"form-group"}>
                                <input name="name" id="name"
                                       type="text"
                                       className={"form-control"}
                                       placeholder="Busca por Nombre, Id, dirección ..."/>
                                <button type="button" className="btn-search">&nbsp;</button>
                            </div>
                        </div>
                    </div>

                    <div className="tabs row">
                        <ul>
                            <li className="active">Ver todo</li>
                            <li>Opción 1</li>
                            <li>Opción 2</li>
                        </ul>
                    </div>

                    <Table/>

                </div>
            </div>
        );
    }
}

export default Home;
