import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import store from "../../../../store";
import "./Asistencias.scss";

class Tab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index: 1,
            plans: store.getState().AllPlans,
            assistsTotal: 0
        };
        for (let i = 0; i < 3; i++) {
            this.state.plans[i] = {
                assists: [
                    {
                        name: "",
                        values: []
                    }
                ]
            }
        }
        store.subscribe(() => {
            let storeState = store.getState();
            let index = storeState.indexPlan;
            let plans = storeState.AllPlans;
            if (this.state.index !== index || this.state.plans !== plans) {
                this.setState({
                    ...this.state,
                    index: index,
                    plans: plans
                });
                setTimeout(function () {
                    this.countAsistencias();
                }.bind(this), 100);
            }
        });

    }

    countAsistencias() {
        if (typeof this.state.plans[this.state.index] === "undefined") return;
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

    checkAsistencia = (index, key, k, i, parent) => e => {
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
    };

    render() {
        return (
            <div className="asistencias-group">
                {typeof this.state.plans[this.state.index].assists !== "undefined" && this.state.plans[this.state.index].assists.map((option, key) =>
                    <div className={"row row-max tabs-cotizaciones row_tab_1 " + (key + 1)} key={key}>
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 no-padding">
                            <div className="row" onClick={this.props.toggleSlide(key + 1)}>
                                <div className="col col-12 col-sm-12 col-md-6 col-lg-6 text-left">
                                    <h4>
                                        <span>{this.state.assistsTotal}</span>{option.name}
                                    </h4>
                                </div>
                                <div className="col col-12 col-sm-12 col-md-6 col-lg-6 text-right">
                                    <div className="close-section closeclose">Ocultar <i>&nbsp;</i></div>
                                    <div className="close-section open">Ver <i>&nbsp;</i></div>
                                </div>
                            </div>
                            <div className="wrapper-box asistencias">
                                {option.values.map((opt, k) =>
                                    <div className="rowor" key={k}>
                                        <div className="row">
                                            <div
                                                className="col col-12 col-sm-12 col-md-12 col-lg-12 asistencia items-checkboxes">
                                                <div className="form-group">
                                                    <input type="checkbox" name={"itemm" + k + "_" + key}
                                                           id={"itemm" + k + "_" + key}
                                                           checked={(opt.checked === true ? 'checked' : false)}
                                                           onChange={this.checkAsistencia(this.state.index, key, k, 0, true)}
                                                    />
                                                    <div className="group">
                                                        <label htmlFor={"itemm" + k + "_" + key}>{opt.name}</label>
                                                        <p>plomería, electricidad, vidrios y cerrajería</p>
                                                    </div>
                                                    {opt.assists.map((opt, i) =>
                                                        <div className="row" key={i}>
                                                            <div
                                                                className="col col-12 col-sm-12 col-md-12 col-lg-12 items-checkboxes">
                                                                <input type="checkbox"
                                                                       name={"itemm" + k + "_" + key + "_" + i}
                                                                       id={"itemm" + k + "_" + key + "_" + i}
                                                                       checked={(opt.checked === true ? 'checked' : false)}
                                                                       onChange={this.checkAsistencia(this.state.index, key, k, i)}
                                                                />
                                                                <div className="group">
                                                                    <label
                                                                        htmlFor={"itemm" + k + "_" + key + "_" + i}>{opt.name}</label>
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
        )
    }

}

export default withRouter(Tab);