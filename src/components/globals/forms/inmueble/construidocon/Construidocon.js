import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actionCreators';

import './Construidocon.scss';

class Construidocon extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            show: false,
            active: 0
        };
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

    render() {
        return (
            <div className={"gridgrid form-group " + (this.state.error?'error':'')}>
                <label htmlFor="doc-type-value">El inmueble está construido con</label>
                <div className="row grid-select">
                    <div className="col col-6 col-sm-12 col-md-4 col-lg-4">
                        <div className={"select-item row " + ((this.state.active === 1) ? 'active' : '')}
                             onClick={(e) => {
                                 this.validateEmpty({
                                     data: 1,
                                     value: 1,
                                     name: "construidocon"
                                 });
                             }}
                        >
                            <div className="col col-12 no-padding">
                                <i className="concreto"></i>
                            </div>
                            <div className="col col-12 no-padding">
                                <p>Murosen concreto</p>
                            </div>
                        </div>
                    </div>

                    <div className="col col-6 col-sm-12 col-md-4 col-lg-4">
                        <div className={"select-item row " + ((this.state.active === 2) ? 'active' : '')}
                             onClick={(e) => {
                                 this.validateEmpty({
                                     data: 2,
                                     value: 2,
                                     name: "construidocon"
                                 });
                             }}
                        >
                            <div className="col col-12 no-padding">
                                <i className="ladrillo"></i>
                            </div>
                            <div className="col col-12 no-padding">
                                <p>Mampostería (ladrillo)</p>
                            </div>
                        </div>
                    </div>

                    <div className="col col-6 col-sm-12 col-md-4 col-lg-4">
                        <div className={"select-item row " + ((this.state.active === 3) ? 'active' : '')}
                             onClick={(e) => {
                                 this.validateEmpty({
                                     data: 3,
                                     value: 3,
                                     name: "construidocon"
                                 });
                             }}
                        >
                            <div className="col col-12 no-padding">
                                <i className="aceror"></i>
                            </div>
                            <div className="col col-12 no-padding">
                                <p>Acero reforzado</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row grid-select">
                    <div className="col col-6 col-sm-12 col-md-4 col-lg-4">
                        <div className={"select-item row " + ((this.state.active === 4) ? 'active' : '')}
                             onClick={(e) => {
                                 this.validateEmpty({
                                     data: 4,
                                     value: 4,
                                     name: "construidocon"
                                 });
                             }}
                        >
                            <div className="col col-12 no-padding">
                                <i className="bahareque"></i>
                            </div>
                            <div className="col col-12 no-padding">
                                <p>Bahareque</p>
                            </div>
                        </div>
                    </div>

                    <div className="col col-6 col-sm-12 col-md-4 col-lg-4">
                        <div className={"select-item row " + ((this.state.active === 5) ? 'active' : '')}
                             onClick={(e) => {
                                 this.validateEmpty({
                                     data: 5,
                                     value: 5,
                                     name: "construidocon"
                                 });
                             }}
                        >
                            <div className="col col-12 no-padding">
                                <i className="madera"></i>
                            </div>
                            <div className="col col-12 no-padding">
                                <p>Madera</p>
                            </div>
                        </div>
                    </div>

                    <div className="col col-6 col-sm-12 col-md-4 col-lg-4">
                        <div className={"select-item row " + ((this.state.active === 6) ? 'active' : '')}
                             onClick={(e) => {
                                 this.validateEmpty({
                                     data: 6,
                                     value: 6,
                                     name: "construidocon"
                                 });
                             }}
                        >
                            <div className="col col-12 no-padding">
                                <i className="adobe"></i>
                            </div>
                            <div className="col col-12 no-padding">
                                <p>Adobe</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Construidocon;



