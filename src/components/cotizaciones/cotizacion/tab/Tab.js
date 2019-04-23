import React from 'react';
import './Tab.scss';
import {withRouter} from "react-router-dom";
import AllPlans from '../../../../services/AllPlans';
import Helpers from "../../../../common/helpers/helpers/Helpers";
import Masknumbermoney from "../../../../common/helpers/masknumbermoney/Masknumbermoney";
import store from "../../../../store";
import {toggleLoading} from "../../../../actionCreators";

class Tab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
            index: 1,
            plans: [],
            assistsTotal: 0,
            coverturasTotal: 0,
            Inmueble: store.getState().Inmueble,
            plansOks: false
        };
        store.dispatch(toggleLoading(true));
        for (let i = 0; i < 3; i++) {
            this.state.plans[i] = {
                assists: [
                    {
                        name: "",
                        values: []
                    }
                ],
                coverages: [
                    {
                        name: "",
                        values: []
                    }
                ]
            }
        }

        store.subscribe(async () => {
            let storeState = store.getState();
            let index = storeState.indexPlan;
            let inmueble = storeState.Inmueble;
            if (inmueble !== this.state.Inmueble) {
                let type = 0;
                if (inmueble.inmuebleasegudado === 1 && inmueble.contenidoasegudado === 1) {
                    type = 3;
                } else if (inmueble.inmuebleasegudado === 0 && inmueble.contenidoasegudado === 1) {
                    type = 2;
                } else if (inmueble.inmuebleasegudado === 1 && inmueble.contenidoasegudado === 0) {
                    type = 1;
                }
                this.setState({
                    ...this.state,
                    Inmueble: inmueble
                });
                if (this.state.plansOks === false) this.getPlants(type);
            }
            if (this.state.index !== index) {
                this.setState({
                    ...this.state,
                    index: index
                });
                let it = this;
                setTimeout(function () {
                    it.countCoverturas();
                    it.countAsistencias();
                }, 100);
            }
        });

    }

    toogleSlide(index) {
        let className = "close_item";
        if (Helpers.hasClass(".row_tab_" + index, className)) {
            Helpers.removeClass(".row_tab_" + index, className);
        } else {
            let el = document.querySelector(".row_tab_" + index + " .wrapper-box");
            el.style.height = el.clientHeight + "px";
            Helpers.addClass(".row_tab_" + index, className);
        }
    }

    countCoverturas() {
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

    countAsistencias() {
        let t = 0;
        let item = this.state.plans[this.state.index].assists[0].values;
        for (let i in item) {
            if (item[i].checked === true) t++;
            if (typeof item[i].assists !== 'undefined') {
                for (let o in item[i].assists) {
                    if (item[i].assists[o].checked === true) t++;
                }
            }
        }
        this.setState({
            ...this.state,
            assistsTotal: t
        });
    }

    checkCoverturas(index, key) {
        let check = this.state.plans[index].coverages[key].checked;
        let newPlans = this.state.plans;
        newPlans[index].coverages[key].checked = !check;
        this.setState({
            ...this.state,
            plans: newPlans
        });
        this.countCoverturas();
    }

    checkAsistencia(index, key, k, i, parent) {
        let check;
        let newPlans;
        if (typeof parent !== 'undefined') {
            check = this.state.plans[index].assists[key].values[k].checked;
            newPlans = this.state.plans;
            newPlans[index].assists[key].values[k].checked = !check;
        } else {
            check = this.state.plans[index].assists[key].values[k].assists[i].checked;
            newPlans = this.state.plans;
            newPlans[index].assists[key].values[k].assists[i].checked = !check;
        }
        this.setState({
            ...this.state,
            plans: newPlans
        });
        this.countAsistencias();
    }

    async getPlants(type) {
        let plans = await AllPlans.get(type);
        this.setState({
            ...this.state,
            plans: plans,
            plansOks: true
        });
        this.countCoverturas();
        this.countAsistencias();
        setTimeout(function () {
            store.dispatch(toggleLoading(false));
        }, 1000);
    }

    getSelectByItems(item) {
        for (let i in item) {
            if (item[i].default === true) {
                return item[i].id;
            }
        }
        return "";
    }

    getSelectFields(item) {
        for (let i in item) {
            if (item[i].default === true) {
                return i;
            }
        }
        return "";
    }

    getValueFields(item) {
        let inmueble = this.state.Inmueble;
        if (item.id === 1) {
            return Masknumbermoney.formatToMask(
                Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadovalor) * parseInt(item.value) / 100);
        } else if (item.id === 2) {
            return Masknumbermoney.formatToMask(
                Masknumbermoney.formatToNumber(inmueble.contenidoasegudadovalor) * parseInt(item.value) / 100);
        } else if (item.id === 3) {
            return Masknumbermoney.formatToMask(
                Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadojoyasvalor) * parseInt(item.value) / 100);
        }
        return 'N/A';
    }

    render() {
        return (
            <div>

                <div className="first-content">
                    <div className="row">
                        <div className="col col-12 col-md-3 col-lg-3">
                            <p className="textdescript">Ver asistencias</p>
                        </div>
                        <div className="col col-12 col-md-6 col-lg-6">
                            <p className="centerdescription"><span>Financiación</span> $30.000 / 10 cuotas</p>
                        </div>
                        <div className="col col-12 col-md-3 col-lg-3">
                        </div>
                    </div>
                </div>
                <div className="wrapper-items">

                    <div className="row row-max tabs-cotizaciones row_tab_0">
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 no-padding">
                            <div className="row" onClick={(e) => {
                                this.toogleSlide(0);
                            }}>
                                <div className="col col-12 col-sm-12 col-md-6 col-lg-6 text-left">
                                    <h4>
                                        <span>{this.state.coverturasTotal}</span>Coberturas
                                    </h4>
                                </div>
                                <div className="col col-12 col-sm-12 col-md-6 col-lg-6 text-right">
                                    <div className="close-section closeclose">Ocultar <i></i></div>
                                    <div className="close-section open">Ver <i></i></div>
                                </div>
                            </div>

                            <div className="wrapper-box">
                                {this.state.plans[this.state.index].coverages.map((option, key) =>
                                    <div className={"rowor " + (option.optional === true ? '' : 'disabled-item')}
                                         key={key}>
                                        <div className="row">
                                            <div
                                                className="col first items-checkboxes">
                                                <div className="form-group">
                                                    <input type="checkbox"
                                                           checked={(option.checked === true ? 'checked' : false)}
                                                           disabled={(option.optional === false)}
                                                           name="incendios" id="incendios"
                                                           onChange={(e) => {
                                                               this.checkCoverturas(this.state.index, key);
                                                           }}
                                                    />
                                                    <label htmlFor="incendios">{option.name}</label>
                                                </div>
                                            </div>
                                            <div className="col col-12 col-sm-12 col-md-3 col-lg-3 middle">
                                                {typeof option.values !== "undefined" &&
                                                <div>
                                                    {option.values.map((opt, k) =>
                                                        <div className={"contenidoasegudadovalor form-group"} key={k}>
                                                            <label htmlFor="contenidoasegudadovalor">{opt.name}</label>
                                                            {typeof opt.value !== 'undefined' ? (
                                                                <input name="contenidoasegudadovalor"
                                                                       id="contenidoasegudadovalor"
                                                                       placeholder={Masknumbermoney.formatToMask(opt.value)}
                                                                       value={this.getValueFields(opt)}
                                                                       onChange={(e) => {
                                                                       }}
                                                                       disabled={(option.optional === false)}
                                                                       type="text" className={"form-control"}/>
                                                            ) : (
                                                                <select defaultValue={this.getSelectFields(opt.values)}
                                                                        className="form-control" onChange={(e) => {
                                                                }}>
                                                                    {opt.values.map((opt, k) =>
                                                                        <option key={k}
                                                                                value={k}>{Masknumbermoney.formatToMask(opt.limit)}</option>
                                                                    )}
                                                                </select>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                }
                                            </div>
                                            <div className="col last">
                                                {typeof option.deductible !== 'undefined' ? (
                                                    <div
                                                        className={"pisonumero input-select form-group " + ((this.state.error) ? 'error' : '')}>
                                                        <label htmlFor="pisonumero">Deducible</label>
                                                        <select name="pisonumero" className="form-control"
                                                                disabled={(option.optional === false)}
                                                                defaultValue={this.getSelectByItems(option.deductible)}>
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

                    {this.state.plans[this.state.index].assists.map((option, key) =>
                        <div className="row row-max tabs-cotizaciones row_tab_1" key={key}>
                            <div className="col col-12 col-sm-12 col-md-12 col-lg-12 no-padding">
                                <div className="row" onClick={(e) => {
                                    this.toogleSlide(1);
                                }}>
                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6 text-left">
                                        <h4>
                                            <span>{this.state.assistsTotal}</span>{option.name}
                                        </h4>
                                    </div>
                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6 text-right">
                                        <div className="close-section closeclose">Ocultar <i></i></div>
                                        <div className="close-section open">Ver <i></i></div>
                                    </div>
                                </div>
                                <div className="wrapper-box asistencias">
                                    {option.values.map((opt, k) =>
                                        <div className="rowor" key={k}>
                                            <div className="row">
                                                <div
                                                    className="col col-12 col-sm-12 col-md-12 col-lg-12 asistencia items-checkboxes">
                                                    <div className="form-group">
                                                        <input type="checkbox" name="incendios" id="incendios"
                                                               checked={(opt.checked === true ? 'checked' : false)}
                                                               onChange={(e) => {
                                                                   this.checkAsistencia(this.state.index, key, k, 0, true);
                                                               }}
                                                        />
                                                        <div className="group">
                                                            <label htmlFor="incendios">{opt.name}</label>
                                                            <p>plomería, electricidad, vidrios y cerrajería</p>
                                                        </div>
                                                        {opt.assists.map((opt, i) =>
                                                            <div className="row" key={i}>
                                                                <div
                                                                    className="col col-12 col-sm-12 col-md-12 col-lg-12 items-checkboxes">
                                                                    <input type="checkbox" name="incendios"
                                                                           id="incendios"
                                                                           checked={(opt.checked === true ? 'checked' : false)}
                                                                           onChange={(e) => {
                                                                               this.checkAsistencia(this.state.index, key, k, i);
                                                                           }}
                                                                    />
                                                                    <div className="group">
                                                                        <label htmlFor="incendios">{opt.name}</label>
                                                                        <p>{opt.description}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

}

export default withRouter(Tab);