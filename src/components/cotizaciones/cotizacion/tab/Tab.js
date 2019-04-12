import React from 'react';
import './Tab.scss';
import {withRouter} from "react-router-dom";
import AllPlans from '../../../../services/AllPlans';
import Helpers from "../../../../common/helpers/helpers/Helpers";
import Masknumbermoney from "../../../../common/helpers/masknumbermoney/Masknumbermoney";

//Component

class Tab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
            plans: [
                {
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
            ]
        };
        this.getPlants();
    }

    countCheckedItems(item) {
        let t = 0;
        for (let i in item) {
            if (item[i].checked === true) {
                t++;
            }
        }
        return t;
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

    async getPlants() {
        let plans = await AllPlans.get();
        console.log(plans[0].coverages);
        this.setState({
            ...this.state,
            plans: plans
        });
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
                                    <h4><span>{this.countCheckedItems(this.state.plans[0].coverages)}</span>Coberturas
                                    </h4>
                                </div>
                                <div className="col col-12 col-sm-12 col-md-6 col-lg-6 text-right">
                                    <div className="close-section closeclose">Ocultar <i></i></div>
                                    <div className="close-section open">Ver <i></i></div>
                                </div>
                            </div>

                            <div className="wrapper-box">
                                {this.state.plans[0].coverages.map((option, key) =>
                                    <div className={"rowor "+(option.optional===true?'':'disabled-item')} key={key}>
                                        <div className="row">
                                            <div
                                                className="col col-12 col-sm-12 col-md-4 col-lg-4 first items-checkboxes">
                                                <div className="form-group">
                                                    <input type="checkbox"
                                                           defaultChecked={option.checked}
                                                           name="incendios" id="incendios"/>
                                                    <label htmlFor="incendios">{option.name}</label>
                                                </div>
                                            </div>
                                            <div className="col col-12 col-sm-12 col-md-4 col-lg-4 middle">
                                                {option.values.map((opt, k) =>
                                                    <div className={"contenidoasegudadovalor form-group"} key={k}>
                                                        <label htmlFor="contenidoasegudadovalor">{opt.name}</label>
                                                        <input name="contenidoasegudadovalor"
                                                               id="contenidoasegudadovalor"
                                                               placeholder={Masknumbermoney.formatToMask(opt.value)}
                                                               value={opt.value}
                                                               type="text" className={"form-control"}/>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col col-12 col-sm-12 col-md-4 col-lg-4 last">
                                                <div
                                                    className={"pisonumero input-select form-group " + ((this.state.error) ? 'error' : '')}>
                                                    <label htmlFor="pisonumero">Deducible</label>
                                                    <select name="pisonumero" className="form-control"
                                                            value={this.state.value}>
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

                    {this.state.plans[0].assists.map((option, key) =>
                        <div className="row row-max tabs-cotizaciones row_tab_1" key={key}>
                            <div className="col col-12 col-sm-12 col-md-12 col-lg-12 no-padding">
                                <div className="row" onClick={(e) => {
                                    this.toogleSlide(1);
                                }}>
                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6 text-left">
                                        <h4>
                                            <span>{option.values.length}</span>{option.name}
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
                                                        <input type="checkbox" name="incendios" id="incendios"/>
                                                        <div className="group">
                                                            <label htmlFor="incendios">{opt.name}</label>
                                                            <p>plomería, electricidad, vidrios y cerrajería</p>
                                                        </div>
                                                        {opt.assists.map((opt, k) =>
                                                            <div className="row" key={k}>
                                                                <div
                                                                    className="col col-12 col-sm-12 col-md-12 col-lg-12 items-checkboxes">
                                                                    <input type="checkbox" name="incendios"
                                                                           id="incendios" defaultChecked={opt.checked}/>
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