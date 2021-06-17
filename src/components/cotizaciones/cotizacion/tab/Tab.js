import React, {Component, Fragment} from "react";
import { compose } from "recompose";
import {withRouter} from "react-router-dom";
import { connect } from "react-redux";

import "./Tab.scss";
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
import RateNotCalculated from "../../../RateNotCalculated";
import { getItems } from "../../../cotizaciones/cotizacion/cards/getItems";

class Tab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plans: [],
            errorRateCalculated: false,
        };
    }
    
    /**
     * 
     * @returns {[string,string][]}
     */
    getItems() {
      return getItems().map(({ parent }) => [
        parent.nameModel,
        parent.nameModelValue,
      ]);
    }

    isValid(inmueble){
      const keys = this.getItems();
      if (inmueble) {
        const invalid = keys.some(([key, keyValue]) => {
          if (inmueble[key]) {
            const value = Masknumbermoney.formatToNumber(
              inmueble[keyValue] || ''
            );
            const valid = typeof value === 'number' ? value > 0 : false;
            return !valid;
          }
          return false;
        });
        return !invalid;
      }
      return false
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
          const coverage = normal.coverages[j];
          const selectedCoverage = selected.coverages.find(
            findSelectedCoverage(coverage)
          );

          if (selectedCoverage) {
            coverage.optional = selectedCoverage.optional;
            coverage.checked = selectedCoverage.checked;
          }
          if (typeof coverage.values !== 'undefined') {
            for (let i = 0; i < coverage.values.length; i++) {
              const coverageValue = coverage.values[i];
              const selectedCoverageValue =
                selectedCoverage &&
                selectedCoverage.values &&
                selectedCoverage.values.find(({ code }) => {
                  return coverageValue.code === code;
                });
                
              if (coverageValue && coverageValue.hired) {
                const valueSelected = selectedCoverageValue;
                if (valueSelected) {
                  const isDisabled = Coberturas.isDisabled(
                    coverage,
                    valueSelected
                  );
                  const value = !isDisabled
                    ? valueSelected.value_to_quotate
                    : Coberturas.getValue(coverageValue);
                  const rules = {
                    ...getRulesByCode(valueSelected.code, normal.coverages),
                  };
                  coverageValue.value = valueSelected.value;
                  const newValue = getValue(value, rules);
                  coverageValue.value_show = Masknumbermoney.formatToMask(
                    newValue
                  );
                  coverageValue.value_to_quotate = newValue;
                } else if (coverageValue && coverageValue.hired) {
                  const value_show = Coberturas.getValueFields(coverageValue);
                  coverageValue.value_show = value_show;
                }

                if (selectedCoverageValue && selectedCoverageValue.values) {
                  for (let k = 0; k < selectedCoverageValue.values.length; k++) {
                    if (
                      typeof selectedCoverageValue.values[k] !== 'undefined'
                    ) {
                      coverageValue.values[k].default =
                        selectedCoverageValue.values[k].default;
                    }
                  }
                }
              }
            }
          } else {
            //If no is equal the coverage so calc value for this.
            if (coverage.values) {
              coverage.values.forEach((value) => {
                const value_show = Coberturas.getValueFields(value, value.id, {
                  plan: normal,
                });
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
      const { inmueble } = this.props;
      this.getPlans(inmueble)
        .catch(() => {
          this.setState({ errorRateCalculated: true });
        })
        .finally(() => {
          Loading.toggle(false);
        });
    }

    componentWillReceiveProps({ inmueble }) {
      const entries = this.getItems();
      const different = entries.some(
        ([key]) => this.props.inmueble[key] !== inmueble[key]
      );
      if (different) this.updateType(inmueble);
    }


    getType({ contenidoasegudado, inmuebleasegudado }) {
      let type = 3;
      if (inmuebleasegudado === 1 && contenidoasegudado === 1) {
        type = 3;
      } else if (inmuebleasegudado === 0 && contenidoasegudado === 1) {
        type = 2;
      } else if (inmuebleasegudado === 1 && contenidoasegudado === 0) {
        type = 1;
      }
      return type;
    }

    updateType(newInmueble) {
      this.getPlans(newInmueble).catch(() => {
        Loading.toggle(false);
        this.setState({ errorRateCalculated: true });
      });
    }

    async getPlans(inmueble = null) {
        if (!this.isValid(inmueble)) {
          Loading.toggle(false);
          return;
        }
        Loading.toggle(true);
        const type = this.getType(inmueble);
        const quotateId = this.props.match.params.id;
        let plans = await AllPlans.get(type);
        let plan = await QuoteIussedById.get(quotateId);
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
            if (!this.props.indexPlan) {
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
        const { indexPlan } = this.props;
        const { plans, errorRateCalculated } = this.state;
        
        const plan = !!(plans && plans[indexPlan]); 
        return (
          <Fragment>
            {!plan && <div className="hide">&nbsp;</div>}
            {plan && (
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
                    <div className="col col-12 col-md-3 col-lg-3" />
                  </div>
                </div>
                <div className="wrapper-items">
                  <Coberturas />
                  <Asistencias />
                </div>
              </Fragment>
            )}
            <RateNotCalculated
              open={errorRateCalculated}
              onRetry={() => {
                this.getPlans(this.props.inmueble)
                  .then(() => {
                      this.setState({ errorRateCalculated: false });
                  })
                  .catch((e) => {
                    Loading.toggle(false);
                  });
              }}
            />
          </Fragment>
        );
    }
}

export default compose(
  withRouter,
  connect(({ indexPlan, Inmueble }) => {
    return { indexPlan, inmueble: Inmueble };
  })
)(Tab);
