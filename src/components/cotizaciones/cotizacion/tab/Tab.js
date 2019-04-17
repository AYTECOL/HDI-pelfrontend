import React from 'react';
import './Tab.scss';
import {withRouter} from "react-router-dom";
import AllPlans from '../../../../services/AllPlans';
import Helpers from "../../../../common/helpers/helpers/Helpers";
import Masknumbermoney from "../../../../common/helpers/masknumbermoney/Masknumbermoney";
import store from "../../../../store";

class Tab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
            index: 1,
            plans: [],
            assistsTotal: 0,
            coverturasTotal: 0
        };
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
            if (this.state.index !== index) {
                this.setState({
                    ...this.state,
                    index: index
                });
                let it = this;
                setTimeout(function() {
                    it.countCoverturas();
                    it.countAsistencias();
                }.bind(this), 100);
            }
        });

        this.getPlants();
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

    async getPlants() {
        let plans = await AllPlans.get();
        this.setState({
            ...this.state,
            plans: plans
        });
        this.countCoverturas();
        this.countAsistencias();
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
                                                {option.values.map((opt, k) =>
                                                    <div className={"contenidoasegudadovalor form-group"} key={k}>
                                                        <label htmlFor="contenidoasegudadovalor">{opt.name}</label>
                                                        {typeof opt.value !== 'undefined' ? (
                                                            <input name="contenidoasegudadovalor"
                                                                   id="contenidoasegudadovalor"
                                                                   placeholder={Masknumbermoney.formatToMask(opt.value)}
                                                                   defaultValue={opt.value}
                                                                   disabled={(option.optional === false)}
                                                                   type="text" className={"form-control"}/>
                                                        ):(
                                                            <select className="form-control">
                                                                {opt.values.map((opt, k) =>
                                                                    <option selected={(opt.default===true?'selected':false)} key={k} value={k}>{opt.limit}</option>
                                                                )}
                                                            </select>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col last">
                                                <div
                                                    className={"pisonumero input-select form-group " + ((this.state.error) ? 'error' : '')}>
                                                    <label htmlFor="pisonumero">Deducible</label>
                                                    <select name="pisonumero" className="form-control"
                                                            disabled={(option.optional === false)}
                                                            defaultValue={this.state.value}>
                                                        <option value="">Sin Deducible</option>
                                                    </select>
                                                </div>
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