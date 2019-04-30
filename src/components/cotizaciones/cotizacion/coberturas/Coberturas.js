import React, {Component, Fragment} from 'react';
import {withRouter} from "react-router-dom";
import Masknumbermoney from "../../../../common/helpers/masknumbermoney/Masknumbermoney";
import store from "../../../../store";

class Tab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            plans: store.getState().AllPlans,
            index: 0,
            coverturasTotal: 0,
            Inmueble: {},
        };
        for (let i = 0; i < 3; i++) {
            this.state.plans[i] = {
                coverages: [
                    {
                        name: "",
                        values: []
                    }
                ]
            }
        }
        store.subscribe(() => {
            let storeState = store.getState();
            if (this.state.plans !== storeState.AllPlans || storeState.Inmueble !== this.state.Inmueble || this.state.index !== storeState.indexPlan) {
                this.setState({
                    ...this.state,
                    plans: storeState.AllPlans,
                    Inmueble: storeState.Inmueble,
                    index: storeState.indexPlan,
                });
                setTimeout(function () {
                    this.countCoverturas();
                }.bind(this), 100);
            }
        });

    }

    static getSelectByItems(item) {
        for (let i in item) {
            if (item[i].default === true) {
                return item[i].id;
            }
        }
        return "";
    }

    static getSelectFields(item) {
        for (let i in item) {
            if (item[i].default === true) {
                return i;
            }
        }
        return "";
    }

    countCoverturas() {
        if (typeof this.state.plans[this.state.index] === "undefined") return;
        let t = 0;
        let item = this.state.plans[this.state.index].coverages;
        for (let i in item) {
            if (item[i].checked === true) {
                t++;
            }
        }
        this.setState({
            ...this.state,
            coverturasTotal: t
        });
    }

    checkCoverturas = (index, key) => e => {
        let check = this.state.plans[index].coverages[key].checked;
        let newPlans = this.state.plans;
        newPlans[index].coverages[key].checked = !check;
        this.setState({
            ...this.state,
            plans: newPlans
        });
        this.countCoverturas();
    };

    getCoverangeById(id) {
        let plans = this.state.plans[this.state.index].coverages;
        for (let i = 0; i < plans.length; i++) {
            if (plans[i].id === id) {
                return plans[i];
            }
        }
    }

    getValueFields(item) {
        try {
            let inmueble = store.getState().Inmueble;
            // Inmueble
            if (item.id === 1) {
                return Masknumbermoney.formatToMask(
                    Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadovalor) * parseInt(item.value) / 100);
                //Contenidos
            } else if (item.id === 2) {
                return Masknumbermoney.formatToMask(
                    Masknumbermoney.formatToNumber(inmueble.contenidoasegudadovalor) * parseInt(item.value) / 100);
                //Obras
            } else if (item.id === 3) {
                return Masknumbermoney.formatToMask(
                    Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadoobrasvalor) * parseInt(item.value) / 100);
                //Telefonos moviles
            } else if (item.id === 4) {
                return Masknumbermoney.formatToMask(
                    Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadotelefonosvalor) * parseInt(item.value) / 100);
                //Hurto siempre basado en hurto calificado
            } else if (item.id === 5) {
                let dataHurto = [];
                let hurto = this.getCoverangeById(3);
                for (let i = 0; i < hurto.values.length; i++) dataHurto.push(this.getValueFields(hurto.values[i]));
                return Masknumbermoney.formatToMask(
                    (Masknumbermoney.formatToNumber(dataHurto[0]) + Masknumbermoney.formatToNumber(dataHurto[1])) * parseInt(item.value) / 100);
                //Joyas
            } else if (item.id === 6) {
                return Masknumbermoney.formatToMask(
                    Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadojoyasvalor) * parseInt(item.value) / 100);
                //Contenido mobile
            } else if (item.id === 7) {
                let joyas = Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadojoyasvalor) * 100 / 100;
                let contenido = Masknumbermoney.formatToNumber(inmueble.contenidoasegudadovalor) * 10 / 100;
                let telefonos = Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadotelefonosvalor) * 100 / 100;
                return Masknumbermoney.formatToMask(
                    (joyas + contenido + telefonos) * parseInt(item.value) / 100);
            }
            return 'N/A';
        } catch (e) {
            return 'N/A';
        }
    }

    inputChange = () => {

    };

    render() {
        return (
            <div className="row row-max tabs-cotizaciones row_tab_0">
                <div className="col col-12 col-sm-12 col-md-12 col-lg-12 no-padding">
                    <div className="row" onClick={this.props.toogleSlide(0)}>
                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 text-left">
                            <h4>
                                <span>{this.state.coverturasTotal}</span>Coberturas
                            </h4>
                        </div>
                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 text-right">
                            <div className="close-section closeclose">Ocultar <i>&nbsp;</i></div>
                            <div className="close-section open">Ver <i>&nbsp;</i></div>
                        </div>
                    </div>

                    <div className="wrapper-box">
                        {typeof this.state.plans[this.state.index].coverages !== "undefined" && this.state.plans[this.state.index].coverages.map((option, key) =>
                            <div className={"rowor " + (option.optional === true ? '' : 'disabled-item')}
                                 key={key}>
                                <div className="row">
                                    <div
                                        className="col first items-checkboxes">
                                        <div className="form-group">
                                            <input type="checkbox"
                                                   checked={(option.checked === true ? 'checked' : false)}
                                                   disabled={(option.optional === false)}
                                                   name={"itemcheck" + key} id={"itemcheck" + key}
                                                   onChange={this.checkCoverturas(this.state.index, key)}
                                            />
                                            <label htmlFor={"itemcheck" + key}>{option.name}</label>
                                        </div>
                                    </div>
                                    <div className="col col-12 col-sm-12 col-md-3 col-lg-3 middle">
                                        {typeof option.values !== "undefined" &&
                                        <Fragment>
                                            {option.values.map((opt, k) =>
                                                <div
                                                    className={"form-group " + (typeof opt.value !== 'undefined' ? '' : 'input-select')}
                                                    key={k}>
                                                    <label htmlFor={"item" + k + "_" + key}>{opt.name}</label>
                                                    {typeof opt.value !== 'undefined' ? (
                                                        <input name={"item" + k + "_" + key}
                                                               id={"item" + k + "_" + key}
                                                               placeholder={Masknumbermoney.formatToMask(opt.value)}
                                                               value={this.getValueFields(opt)}
                                                               onChange={this.inputChange}
                                                               disabled={(option.optional === false)}
                                                               type="text" className={"form-control"}/>
                                                    ) : (
                                                        <select className={"form-control"} name={"item" + k + "_" + key}
                                                                id={"item" + k + "_" + key}
                                                                value={Tab.getSelectFields(opt.values)}
                                                                onChange={this.inputChange}>
                                                            {opt.values.map((opt, k) =>
                                                                <option key={k}
                                                                        value={k}>{Masknumbermoney.formatToMask(opt.limit)}</option>
                                                            )}
                                                        </select>
                                                    )}
                                                </div>
                                            )}
                                        </Fragment>
                                        }
                                    </div>
                                    <div className="col last">
                                        {typeof option.deductible !== 'undefined' ? (
                                            <div
                                                className={"pisonumero input-select form-group " + ((this.state.error) ? 'error' : '')}>
                                                <label htmlFor={"itemdeducible" + key}>Deducible</label>
                                                <select name={"itemdeducible" + key} id={"itemdeducible" + key}
                                                        className="form-control"
                                                        disabled={(option.optional === false)}
                                                        defaultValue={Tab.getSelectByItems(option.deductible)}>
                                                    <option value="">Sin Deducible</option>
                                                    {option.deductible.map((opt, k) =>
                                                        <option key={k} value={opt.id}>{opt.name}</option>
                                                    )}
                                                </select>
                                            </div>
                                        ) : (<div className={"form-group"}>&nbsp;</div>)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        )
    }

}

export default withRouter(Tab);