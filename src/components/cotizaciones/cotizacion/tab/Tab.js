import React, {Component, Fragment} from "react";
import "./Tab.scss";
import {withRouter} from "react-router-dom";
import AllPlans from "../../../../services/AllPlans";
import store from "../../../../store";
import {AllPlans as AllPlansCreator, indexPlanSelected} from "../../../../actions";
//Components
import Coberturas from "../coberturas/Coberturas";
import Asistencias from "../asistencias/Asistencias";
import Loading from "../../../globals/loading/Loading";
import QuoteIussedById from "../../../../services/QuoteIussedById";
import DeterminePolizaPrima from "../../../../services/DeterminePolizaPrima";
import BtnContinue from "../forms/btncontinue/BtnContinue";
import Cards from "../cards/Cards";
import { getRulesByCode, getValue } from "../../../../common";
import Masknumbermoney from "../../../../common/helpers/masknumbermoney/Masknumbermoney";

class Tab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plans: [],
            Inmueble: {},
            typePlans: 3,
            index: "",
        };
    }

    //Make merge between default plan and seleted plan
    /**
     * 
     * @param {import("../coberturas/Coberturas").PlanSelectedInfoItem} selected 
     * @param {import("../coberturas/Coberturas").PlanSelectedInfoItem} normal 
     */
    static assignValuesSaved(selected, normal) {
        const isEqual = (a, b) => a && b && a === b;
        /**
         * 
         * @param {import("../coberturas/Coberturas").Coverage} coverage 
         */
        const findSelectedCoverage = (coverage) => ({ code_real_estate, code_content }) => {
          return (
            isEqual(coverage.code_real_estate, code_real_estate) ||
            isEqual(coverage.code_content, code_content)
          );
        };
        for (let j = 0; j < normal.coverages.length; j++) {
            const coverage = normal.coverages[j]
            const selectedCoverage = selected.coverages.find(
              findSelectedCoverage(coverage)
            );
            if (selectedCoverage) {
                coverage.optional = selectedCoverage.optional;
                coverage.checked = selectedCoverage.checked;
                if (typeof coverage.values !== "undefined") {
                    for (let i = 0; i < coverage.values.length; i++) {
                        const coverageValue = coverage.values[i];
                        if (
                          coverageValue &&
                          coverageValue.hired
                        ) {
                            if (!selectedCoverage.values || !coverageValue.values) {
                              const valueSelected = selectedCoverage.values[i];
                              if (valueSelected) {
                                const { value_to_quotate } = valueSelected;
                                const rules = {
                                  ...getRulesByCode(
                                    valueSelected.code,
                                    normal.coverages
                                  ),
                                };
                                coverageValue.value = valueSelected.value;
                                const newValue = getValue(
                                  value_to_quotate,
                                  rules
                                );
                                coverageValue.value_show = Masknumbermoney.formatToMask(
                                  newValue
                                );
                                coverageValue.value_to_quotate = newValue;
                              }
                            } else {
                                if (typeof selectedCoverage.values[i].values !== "undefined") {
                                    for (let k = 0; k < coverageValue.values.length; k++) {
                                        if (typeof selectedCoverage.values[i].values[k] !== "undefined") {
                                            coverageValue.values[k].default = selectedCoverage.values[i].values[k].default;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                //If no is equal the coverage so calc value for this.
                if (coverage.values) {
                  coverage.values.forEach((value) => {
                    const value_show = Coberturas.getValueFields(
                      value,
                      value.id,
                      {
                        plan: normal,
                      }
                    );
                    value.value_show = value_show;
                  });
                }
            }
        }
        for (let j = 0; j < normal.assists.length; j++) {
            normal.assists[j].optional = selected.assists[j].optional;
            for (let k = 0; k < normal.assists[j].values.length; k++) {
                normal.assists[j].values[k].optional = selected.assists[j].values[k].optional;
                for (let l = 0; l < normal.assists[j].values[k].assists.length; l++) {
                    normal.assists[j].values[k].assists[l].checked = selected.assists[j].values[k].assists[l].checked;
                    normal.assists[j].values[k].assists[l].optional = selected.assists[j].values[k].assists[l].optional;
                }
            }
        }
        return normal;
    }

    static setMaxDedutibles(plans) {
        for (let i = 0; i < plans.length; i++) {
            for (let j = 0; j < plans[i].coverages.length; j++) {
                if (typeof plans[i].coverages[j].deductible !== "undefined") {
                    let t = plans[i].coverages[j].deductible.length;
                    for (let k = 0; k < t; k++) {
                        plans[i].coverages[j].deductible[k].default = (k + 1) === t;
                    }
                }
            }
        }
        return plans;
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            let storeState = store.getState();
            let inmueble = storeState.Inmueble;
            let indexPlan = storeState.indexPlan;
            if (inmueble !== this.state.Inmueble) {
                this.updateType(inmueble);
            }
            if (this.state.index !== indexPlan) {
                this.setState({
                    ...this.state,
                    index: indexPlan
                });
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    updateType(inmueble) {
        let type = this.state.typePlans;
        let Inmueble = this.state.Inmueble;
        if (inmueble.inmuebleasegudado === 1 && inmueble.contenidoasegudado === 1) {
            type = 3;
        } else if (inmueble.inmuebleasegudado === 0 && inmueble.contenidoasegudado === 1) {
            type = 2;
        } else if (inmueble.inmuebleasegudado === 1 && inmueble.contenidoasegudado === 0) {
            type = 1;
        }

        let status = false;
        //Detect if this.state is not equal to store and validate id empty values.
        if (typeof inmueble.contenidoasegudadovalor !== "undefined") {
            if (inmueble.contenidoasegudadovalor.toString().trim() !== "" && inmueble.contenidoasegudadovalor !== "$0") {
                if (Inmueble.contenidoasegudado !== inmueble.contenidoasegudado) {
                    status = true;
                    //Check when the value is empty on this.state and it is not empty in store
                } else if (Inmueble.contenidoasegudadovalor.toString().trim() === "") {
                    if (Inmueble.contenidoasegudadovalor !== inmueble.contenidoasegudadovalor) {
                        status = true;
                    }
                }
            }
        }

        //Detect if this.state is not equal to store and validate id empty values.
        if (typeof inmueble.inmuebleasegudadovalor !== "undefined") {
            if (inmueble.inmuebleasegudadovalor.toString().trim() !== "" && inmueble.inmuebleasegudadovalor !== "$0") {
                if (Inmueble.inmuebleasegudado !== inmueble.inmuebleasegudado) {
                    status = true;
                    //Check when the value is empty on this.state and it is not empty in store
                } else if (Inmueble.inmuebleasegudadovalor.toString().trim() === "") {
                    if (Inmueble.inmuebleasegudadovalor !== inmueble.inmuebleasegudadovalor) {
                        status = true;
                    }
                }
            }
        }

        if (status === true) {
            this.getPlants(type, inmueble);
        }
        this.setState({
            ...this.state,
            Inmueble: inmueble,
            typePlans: type
        });
    }

    async getPlants(type, inmueble = null) {
        const quotateId = this.props.match.params.id;
        let plans = await AllPlans.get(type);
        let plan = await QuoteIussedById.get(this.props.match.params.id);
        //let inmuble = store.getState().Inmueble;
        let indexSelected = null;

        let selected = plan.plan_selected_info.Item;
        if (typeof selected !== "undefined") {
            indexSelected = parseInt(selected["assists"][0]["selected_id"]);
            const plan = Coberturas.setHiredCoverages(
              plans[indexSelected],
              inmueble
            );
            plans[indexSelected] = Tab.assignValuesSaved(
              selected,
              plan
            );
            plans[indexSelected] = BtnContinue.toNumberCoverrange(plans[indexSelected]);
            //Save in store the index of plan selected
            store.dispatch(indexPlanSelected(indexSelected));
        } else {
            if (this.state.index === "") {
                for (let i in plans) {
                    if (plans[i].isdefault === true) {
                        store.dispatch(indexPlanSelected(i));
                    }
                }
            }
        }
        function setPlanDefault(plan, inmueble) {
          let newPlan = Coberturas.setHiredCoverages(plan, inmueble);
          //Calc values to show
          newPlan = Coberturas.calcValue(newPlan);
          //Add 'value_to_quotate' to each coverange
          newPlan = BtnContinue.toNumberCoverrange(newPlan);
          return newPlan;
        }
        for (let i = 0; i < plans.length; i++) {
            let prospect = 0;
            //Validate if selected plan
            if (indexSelected !== null && i === indexSelected) {
                prospect = await DeterminePolizaPrima.get(
                  plans[i],
                  quotateId
                ).catch(() => {
                  plans[i] = setPlanDefault(plans[i]);
                  return DeterminePolizaPrima.get(plans[i], quotateId);
                });
            } else {
                plans[i] = setPlanDefault(plans[i]);
                prospect = await DeterminePolizaPrima.get(plans[i], quotateId);
            }
            plans[i].value = prospect.prospect;
            plans[i].prima = prospect;
        }

        let inspect = await Cards.getDataFromInspectionPolicy();
        if (inspect !== false) {
            if (inspect[1] === 'IC') {
                //Is IC alter dedutibles of plan.
                plans = Tab.setMaxDedutibles(plans);
            }
        }

        this.setState({
            ...this.state,
            plans: plans
        });
        store.dispatch(AllPlansCreator(plans));
        Loading.toggle(false);
    }

    render() {
        if (typeof this.state.plans !== "undefined" && typeof this.state.plans[this.state.index] === "undefined") return <div
            className="hide">&nbsp;</div>;
        return (
            <Fragment>
                <div className="first-content">
                    <div className="row">
                        <div className="col col-12 col-md-3 col-lg-3">
                            <p className="textdescript">Ver asistencias</p>
                        </div>
                        <div className="col col-12 col-md-6 col-lg-6">
                            {/*<p className="centerdescription">*/}
                                {/*<span>Financiación</span> $30.000 / 10 cuotas*/}
                            {/*</p>*/}
                        </div>
                        <div className="col col-12 col-md-3 col-lg-3"/>
                    </div>
                </div>
                <div className="wrapper-items">
                    <Coberturas/>
                    <Asistencias/>
                </div>
            </Fragment>
        );
    }
}

export default withRouter(Tab);
