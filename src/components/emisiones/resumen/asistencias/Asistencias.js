import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import store from "../../../../store";
import "./Asistencias.scss";
import Plans from "../../../cotizaciones/cotizacion/plans/Plans";
import check from "../../../../common/images/check-img.png";

class Asistencias extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 1,
            plans: store.getState().AllPlans,
            assistsTotal: 0,
            error1: false,
            error2: false
        };
        for (let i = 0; i < 3; i++) {
            this.state.plans[i] = {
                assists: [
                    {
                        name: "",
                        values: []
                    }
                ]
            };
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
                    console.log(plans);
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
            if (typeof item[i].assists !== "undefined") {
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

    sendAndValidate() {
        Plans.sendAndValidate(
            this.state.plans,
            this.state.index,
            this.props.match.params.id
        );
    }

    isCheckedAssistsByCode(code) {
        let index = this.state.index;
        let status = false;
        for (let i = 0; i < this.state.plans[index].assists.length; i++) {
            for (
                let j = 0;
                j < this.state.plans[index].assists[i].values.length;
                j++
            ) {
                for (
                    let k = 0;
                    k < this.state.plans[index].assists[i].values[j].assists.length;
                    k++
                ) {
                    if (
                        parseInt(
                            this.state.plans[index].assists[i].values[j].assists[k].code
                        ) === parseInt(code)
                    ) {
                        status = this.state.plans[index].assists[i].values[j].assists[k]
                            .checked;
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
                for (
                    let k = 0;
                    k < newPlans[index].assists[i].values[j].assists.length;
                    k++
                ) {
                    if (k >= key)
                        newPlans[index].assists[i].values[j].assists[k].checked = false;
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
        if (typeof parent !== "undefined") {
            check = this.state.plans[index].assists[key].values[k].checked;
            newPlans = this.state.plans;
            newPlans[index].assists[key].values[k].checked = !check;
            if (!check === false) newPlans = this.unCheckAssistsNextsByKey(0);
        } else {
            check = this.state.plans[index].assists[key].values[k].assists[i].checked;
            newPlans = this.state.plans;
            if (
                parseInt(newPlans[index].assists[key].values[k].assists[i].code) ===
                9695
            ) {
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
            error2: error2
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
                {typeof this.state.plans[this.state.index].assists !== "undefined" &&
                this.state.plans[this.state.index].assists.map((option, key) => (
                    <div
                        className={"row row-max tabs-cotizaciones row_tab_1 " + (key + 1)}
                        key={key}
                    >
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 no-padding">
                            <div className="row" onClick={this.props.toggleSlide(key + 1)}>
                                <div className="col-md-4 text-left">
                                    <h4>
                                        <span>{this.state.assistsTotal}</span>
                                        {option.name}
                                    </h4>
                                </div>
                                <div className="col-md-4">
                                    <b className="text-include">Incluye</b>
                                </div>
                                <div className="col-md-4 text-right">
                                    <div className="close-section closeclose">
                                        <i className="text-include">&nbsp;</i>
                                    </div>
                                    <div className="close-section open">
                                        <i className="text-include">&nbsp;</i>
                                    </div>
                                </div>
                            </div>
                            <div className="wrapper-box-info">
                                {option.values.map((opt, k) => (
                                    <div
                                        className={
                                            "rowor " +
                                            (opt.optional === false ? "disabled-item" : "")
                                        }
                                        key={k}
                                    >
                                        {opt.checked === true ? (
                                            <div className="asistencia">
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-md-1 center-text">
                                                            <img src={check} alt=""/>
                                                        </div>

                                                        <div className="col-md-4 center-text">
                                                            <label htmlFor={"itemm" + k + "_" + key}>
                                                                {opt.name}
                                                            </label>
                                                        </div>
                                                        <div className="col-md-6 center-text">
                                                            <p className="description-text">
                                                                {opt.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {opt.assists.map((op, i) => (
                                                        <div
                                                            key={i}
                                                            className={
                                                                op.checked === true ? "row" : "row show-div"
                                                            }
                                                        >
                                                            <div className="col-md-1 center-text">
                                                                <img src={check} alt=""/>
                                                            </div>

                                                            <div className="col-md-4 center-text">
                                                                <label
                                                                    htmlFor={"itemm" + k + "_" + key + "_" + i}
                                                                >
                                                                    {op.name}
                                                                </label>
                                                            </div>
                                                            <div className="col-md-6 center-text">
                                                                <p className="description-text">
                                                                    {op.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default withRouter(Asistencias);
