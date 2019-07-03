import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import store from "../../../../store";
import "./Asistencias.scss";
import CreateOrUpdateValoration from "../../../../services/CreateOrUpdateValoration";
import DeterminePolizaPrima from "../../../../services/DeterminePolizaPrima";
import {AllPlans as AllPlansCreator} from "../../../../actions";
import Loading from "../../../globals/loading/Loading";

class Asistencias extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index: 1,
            plans: store.getState().AllPlans,
            assistsTotal: 0,
            error1: false,
            error2: false,
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
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            let storeState = store.getState();
            let index = storeState.indexPlan;
            let plans = storeState.AllPlans;
            if (this.state.index !== index || this.state.plans !== plans) {
                if (index !== "") {
                    this.setState({
                        ...this.state,
                        index: index,
                        plans: plans
                    });
                    setTimeout(() => {
                        this.countAsistencias();
                    }, 100);
                }
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
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

    async sendAndValidate() {
        Loading.toggle(true);
        let plans = this.state.plans;
        await CreateOrUpdateValoration.save();
        let total = await DeterminePolizaPrima.get(plans[this.state.index], this.props.match.params.id);
        if (typeof total.prospect !== "undefined") {
            plans[this.state.index].value = total.prospect;
            store.dispatch(AllPlansCreator(plans));
        }
        Loading.toggle(false);
    }

    isCheckedAssistsByCode(code) {
        let index = this.state.index;
        let status = false;
        for (let i = 0; i < this.state.plans[index].assists.length; i++) {
            for (let j = 0; j < this.state.plans[index].assists[i].values.length; j++) {
                for (let k = 0; k < this.state.plans[index].assists[i].values[j].assists.length; k++) {
                    if (parseInt(this.state.plans[index].assists[i].values[j].assists[k].code) === parseInt(code)) {
                        status = this.state.plans[index].assists[i].values[j].assists[k].checked;
                    }
                }
            }
        }
        return status;
    }

    unCheckAssistsNextsByKey(key) {
        let index = this.state.index;
        let newPlans = this.state.plans;
        for (let i = 0; i < newPlans[index].assists.length; i++) {
            for (let j = 0; j < newPlans[index].assists[i].values.length; j++) {
                for (let k = 0; k < newPlans[index].assists[i].values[j].assists.length; k++) {
                    if (k >= key) newPlans[index].assists[i].values[j].assists[k].checked = false;
                }
            }
        }
        return newPlans;
    }

    checkAsistencia = (index, key, k, i, parent) => e => {
        let check;
        let newPlans;
        let error1 = false;
        let error2 = false;
        if (typeof parent !== 'undefined') {
            check = this.state.plans[index].assists[key].values[k].checked;
            newPlans = this.state.plans;
            newPlans[index].assists[key].values[k].checked = !check;
            if (!check === false) newPlans = this.unCheckAssistsNextsByKey(0);
        } else {
            check = this.state.plans[index].assists[key].values[k].assists[i].checked;
            newPlans = this.state.plans;
            if (parseInt(newPlans[index].assists[key].values[k].assists[i].code) === 9695) {
                if (newPlans[index].assists[key].values[k].checked === false) {
                    error1 = true;
                    error2 = false;
                } else {
                    newPlans[index].assists[key].values[k].assists[i].checked = !check;
                    if (!check === false) newPlans = this.unCheckAssistsNextsByKey(i);
                }
            } else {
                if (this.isCheckedAssistsByCode(9695) === false) {
                    error1 = false;
                    error2 = true;
                } else {
                    newPlans[index].assists[key].values[k].assists[i].checked = !check;
                }
            }
        }
        this.setState({
            ...this.state,
            plans: newPlans,
            error1: error1,
            error2: error2,
        });
        if (error1 === false && error2 === false) {
            setTimeout(() => {
                this.countAsistencias();
            }, 250);
            setTimeout(() => {
                this.sendAndValidate();
            }, 500);
        }
    };

    render() {
        return (
            <div className="asistencias-group">
                {typeof this.state.plans[this.state.index].assists !== "undefined" && this.state.plans[this.state.index].assists.map((option, key) =>
                    <div className={"row row-max tabs-cotizaciones row_tab_1 " + (key + 1)} key={key}>
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 no-padding">
                            <div className="row" onClick={this.props.toggleSlide(key + 1)}>
                                <div className="col col-6 col-sm-6 col-md-6 col-lg-6 text-left">
                                    <h4>
                                        <span>{this.state.assistsTotal}</span>{option.name}
                                    </h4>
                                </div>
                                <div className="col col-6 col-sm-6 col-md-6 col-lg-6 text-right">
                                    <div className="close-section closeclose">Ocultar <i>&nbsp;</i></div>
                                    <div className="close-section open">Ver <i>&nbsp;</i></div>
                                </div>
                            </div>
                            <div className="wrapper-box asistencias">
                                {option.values.map((opt, k) =>
                                    <div className={"rowor " + (opt.optional === false ? 'disabled-item' : '')} key={k}>
                                        <div className="row">
                                            <div
                                                className="col col-12 col-sm-12 col-md-12 col-lg-12 asistencia items-checkboxes">
                                                <div className="form-group">
                                                    <input type="checkbox" name={"itemm" + k + "_" + key}
                                                           id={"itemm" + k + "_" + key}
                                                           checked={(opt.checked === true ? 'checked' : false)}
                                                           disabled={opt.optional === false}
                                                           onChange={this.checkAsistencia(this.state.index, key, k, 0, true)}
                                                    />
                                                    <div className="group">
                                                        <label htmlFor={"itemm" + k + "_" + key}>{opt.name}</label>
                                                        <p>{opt.description}</p>
                                                    </div>
                                                    {opt.assists.map((op, i) =>
                                                        <div className="row" key={i}>
                                                            <div
                                                                className={"col col-12 col-sm-12 col-md-12 col-lg-12 items-checkboxes " + (op.optional === false ? 'disabled' : '')}>
                                                                <input type="checkbox"
                                                                       name={"itemm" + k + "_" + key + "_" + i}
                                                                       id={"itemm" + k + "_" + key + "_" + i}
                                                                       disabled={op.optional === false || opt.optional === false}
                                                                       checked={(op.checked === true ? 'checked' : false)}
                                                                       onChange={this.checkAsistencia(this.state.index, key, k, i)}
                                                                />
                                                                <div className="group">
                                                                    <label
                                                                        htmlFor={"itemm" + k + "_" + key + "_" + i}>{op.name}</label>
                                                                    <p>{op.description}</p>
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
                            <div className="msj-box">
                                <p className={"error " + (this.state.error1 === true ? 'show' : 'hide')}>Por favor
                                    seleccione la Asistencia Básica</p>
                                <p className={"error " + (this.state.error2 === true ? 'show' : 'hide')}>Por favor
                                    seleccione la Asistencia Básica y la Asistencia Hogar Plus</p>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        )
    }

}

export default withRouter(Asistencias);
