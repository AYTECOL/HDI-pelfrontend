import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actions';

import './Construidocon.scss';
import AllBuildMaterial from "../../../../../services/AllBuildMaterial";
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class Construidocon extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            show: false,
            active: 0,
            materials: []
        };
    }

    componentDidMount() {
        this.getMaterials();
        this.unsubscribe = store.subscribe(async () => {
            let storeState = store.getState();
            let value = storeState.Inmueble.construidocon;
            if (this.state.active !== value) {
                this.setState({
                    ...this.state,
                    active: value,
                });
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    async getMaterials() {
        let materials = await AllBuildMaterial.get();
        this.setState({
            ...this.state,
            materials: materials,
        });
    }

    validateEmpty = e => () => {
        let error = false;
        if (e.value.length < 1) error = true;
        if (error === false) Helpers.removeClass(".construidocon", "error");
        store.dispatch(saveInmuebleValue(e));
        Helpers.updatePdfInfo({
            [e.name]: e.text
        });
        this.setState({
            ...this.state,
            error: error,
            active: e.data
        });
    };

    render() {
        return (
            <div className={"construidocon no-icon gridgrid form-group " + (this.state.error ? 'error' : '')}>
                <label htmlFor="construidocon">El inmueble está construido con</label>
                <div className="row grid-select">
                    {this.state.materials.map((option, key) =>
                        <div key={key} className="col col-6 col-sm-12 col-md-4 col-lg-4">
                            <div
                                className={"select-item row " + ((parseInt(this.state.active) === parseInt(option.order)) ? 'active' : '')}
                                onClick={this.validateEmpty({
                                    data: option.order,
                                    value: option.buildMaterialCode,
                                    text: option.answer,
                                    name: "construidocon"
                                })}>
                                <div className="col col-12 no-padding">
                                    {(parseInt(option.order) === 1) ? (
                                        <i className="concreto">&nbsp;</i>) : ("")}
                                    {(parseInt(option.order) === 2) ? (
                                        <i className="ladrillo">&nbsp;</i>) : ("")}
                                    {(parseInt(option.order) === 3) ? (
                                        <i className="aceror">&nbsp;</i>) : ("")}
                                    {(parseInt(option.order) === 4) ? (
                                        <i className="bahareque">&nbsp;</i>) : ("")}
                                    {(parseInt(option.order) === 5) ? (
                                        <i className="madera">&nbsp;</i>) : ("")}
                                    {(parseInt(option.order) === 6) ? (
                                        <i className="adobe">&nbsp;</i>) : ("")}
                                </div>
                                <div className="col col-12 no-padding">
                                    <p>{option.answer}</p>
                                </div>
                                <div className="tool-tip-hover">
                                    <p>{option.description}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Construidocon;



