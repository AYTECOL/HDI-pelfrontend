import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actionCreators';

class Refuerzoestructural extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            anoconstruido: "",
            show: false,
            active: 0,
            errorselect: false
        };

        store.subscribe(async () => {
            let storeState = store.getState();
            let anoconstruido = storeState.Inmueble.anoconstruido;
            let show = false;
            if (this.state.anoconstruido !== anoconstruido && anoconstruido !== "") {
                if (anoconstruido < 4) {
                    show = true;
                }
                this.setState({
                    ...this.state,
                    anoconstruido: anoconstruido,
                    show: show
                });
            }
        });
    }

    validateEmpty(e) {
        let error = false;
        if (e.value.length < 1) error = true;
        store.dispatch(saveInmuebleValue(e));
        this.setState({
            ...this.state,
            error: error,
            active: e.data
        });
    }

    saveValue(e) {
        let error = false;
        if (e.value.length < 1) error = true;
        store.dispatch(saveInmuebleValue(e));
        this.setState({
            ...this.state,
            errorselect: error,
        });
    }

    render() {
        if (this.state.show === false) return <div></div>;
        return (
            <div className="row no-gutters">
                <div className="col col-6">
                    <div className={"form-group " + this.state.error}>
                        <label htmlFor="doc-type-value">Cuenta con refuerzos estructurales</label>
                        <ul className="select-item">
                            <li className={(this.state.active === "1") ? 'active' : ''}
                                onClick={(e) => {
                                    this.validateEmpty({
                                        data: "1",
                                        value: "Si",
                                        name: "refuerzo"
                                    });
                                }}
                            >Si
                            </li>
                            <li className={(this.state.active === "2") ? 'active' : ''}
                                onClick={(e) => {
                                    this.validateEmpty({
                                        data: "2",
                                        value: "No",
                                        name: "refuerzo"
                                    });
                                }}
                            >No
                            </li>
                        </ul>
                    </div>
                </div>
                {(this.state.active === "1") ? (
                    <div className="col col-6">
                        <div className={"input-select form-group " + (this.state.errorselect?'error':'')}>
                            <label htmlFor="doc-type-value">En qué año se hizo el refuerzo estrucutral</label>
                            <select className="form-control"
                                    onChange={(e) => {
                                        this.saveValue({
                                            value: e.target.value,
                                            name: "anorefuerzo"
                                        });
                                    }}
                            >
                                <option value="">Selecciona el año</option>
                                <option value="1">1985-1997</option>
                                <option value="2">1998-2010</option>
                                <option value="3">2011 en adelante</option>
                            </select>
                        </div>
                    </div>
                ) : ("")}
            </div>
        );
    }
}

export default Refuerzoestructural;



