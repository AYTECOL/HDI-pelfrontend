import React, {Component} from 'react';
import store from '../../../../store';
//Componets
import DatosGenerales from '../datosgenerales/Datosgenerales';
import Seguridad from '../seguridad/Seguridad';
import Valoreasegurar from '../valoreasegurar/Valoreasegurar';
import Counter from '../forms/counter/Counter';
import Btns from '../forms/btncontinue/BtnContinue';
// Services
import Risk from '../../../../services/AllRisks';

import './Index.scss';
import {withRouter} from "react-router-dom";
import {saveInmuebleValue, typeInmueble} from "../../../../actions";

class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
            activecasa: 0,
            activeapartamento: 0,
            typeInmueble: 0,
            options: {
                risks: []
            }
        };

        this.getRisks();
        store.subscribe(() => {
            let storeState = store.getState();
            let typeInmueble = storeState.typeInmueble;
            let type = storeState.Inmueble.type_risk_id;
            if (this.state.typeInmueble !== typeInmueble || (type !== "" && this.state.active !== type)) {
                this.setState({
                    ...this.state,
                    typeInmueble: typeInmueble,
                    active: type
                });
            }
        });
    }

    async getRisks() {
        let risks = await Risk.get();
        this.setState({
            ...this.state,
            options: risks
        });
    }

    active = option => e => {
        let item = parseInt(option.riskId);
        let type = parseInt(option.riskId);
        store.dispatch(typeInmueble(item));
        store.dispatch(saveInmuebleValue({
            name: "type_risk",
            value: type
        }));
        store.dispatch(saveInmuebleValue({
            name: "type_risk_id",
            value: item
        }));
        this.setState({
            ...this.state,
            active: item,
            typeInmueble: item
        });
    };

    render() {
        if (this.state.step !== 2) return <div className="hide">&nbsp;</div>;
        return (
            <form autoComplete="off" className="index-form inmueble">
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 title">
                            <h2>Descríbenos el inmueble</h2>
                            <p>Falta poco, diligencia la siguiente información, es importante conocer el contexto del
                                riesgo a asegurar</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 content-select">
                            <ul>
                                {this.state.options.risks.map(option =>
                                    <li key={option.riskId}
                                        data={option.riskId}
                                        className={parseInt(this.state.active) === parseInt(option.riskId) ? 'active' : ''}
                                        onClick={this.active(option)}>
                                        <i className={(parseInt(option.riskId) === 1) ? "home-icon" : "apartamento-icon"}>&nbsp;</i>
                                        <p>{option.risk_type}</p>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className={(this.state.typeInmueble === 0) ? 'hide' : ''}>
                        <DatosGenerales/>

                        <hr/>

                        <Seguridad/>

                        <hr/>

                        <Valoreasegurar/>

                        <div className="row text-center">
                            <div className="col col-12">
                                <Counter/>
                            </div>
                        </div>

                        <div className="row text-center">
                            <div className="col col-12">
                                <Btns/>
                            </div>
                        </div>
                    </div>

                </div>
            </form>
        )
    }
}

export default withRouter(Index);