import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import AllPlans from '../../../../services/AllPlans';
import store from '../../../../store';
import {
  AllPlans as AllPlansCreator,
  indexPlanSelected,
} from '../../../../store/actions';
//Components
import Coberturas from '../coberturas/Coberturas';
import Asistencias from '../asistencias/Asistencias';
import Loading from '../../../globals/loading/Loading';
import QuoteIussedById from '../../../../services/QuoteIussedById';
import DeterminePolizaPrima from '../../../../services/DeterminePolizaPrima';
import BtnContinue from '../forms/btncontinue/BtnContinue';
import Cards from '../cards/Cards';
import { getRulesByCode, getValue } from '../../../../common';
import Masknumbermoney from '../../../../common/helpers/masknumbermoney/Masknumbermoney';
import RateNotCalculated from '../../../RateNotCalculated';
import { getItems } from '../../../cotizaciones/cotizacion/cards/getItems';
import moment from 'moment';
import ModalLimitsPlanError from '../../../../components/modal/ModalLimitsPlanError';

class Tab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plans: [],
      errorRateCalculated: false,
      typeError: 0,
      retryCount: 0,
      retryLimitReached: false,
      showButtonReturn: false,
    };
    this.planLoaded = false;
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

  isValid(inmueble) {
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
    return false;
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
    const findSelectedCoverage =
      (coverage) =>
      ({ code_real_estate, code_content }) => {
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
              const isDisabled = Coberturas.isDisabled(coverage, valueSelected);
              const value = !isDisabled
                ? valueSelected.value_to_quotate
                : Coberturas.getValue(coverageValue);
              const rules = {
                ...getRulesByCode(valueSelected.code, normal.coverages),
              };
              coverageValue.value = valueSelected.value;
              const newValue = getValue(value, rules);
              coverageValue.value_show = Masknumbermoney.formatToMask(newValue);
              coverageValue.value_to_quotate = newValue;
            } else {
              const value_show = Coberturas.getValueFields(coverageValue);
              coverageValue.value_show = value_show;
            }

            if (selectedCoverageValue && selectedCoverageValue.values) {
              for (let k = 0; k < selectedCoverageValue.values.length; k++) {
                if (typeof selectedCoverageValue.values[k] !== 'undefined') {
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
      const assist = normal.assists[j];
      const selectedAssist = selected.assists[j];
      assist.optional = selectedAssist.optional;
      for (let k = 0; k < assist.values.length; k++) {
        const value = assist.values[k];
        const valueSelected = selectedAssist.values[k];
        value.optional = valueSelected.optional;
        for (let l = 0; l < value.assists.length; l++) {
          value.assists[l].checked = valueSelected.assists[l].checked;
          value.assists[l].optional = valueSelected.assists[l].optional;
        }
      }
    }
    return normal;
  }

  static setMaxDedutibles(plans) {
    for (let i = 0; i < plans.length; i++) {
      for (let j = 0; j < plans[i].coverages.length; j++) {
        if (typeof plans[i].coverages[j].deductible !== 'undefined') {
          let t = plans[i].coverages[j].deductible.length;
          for (let k = 0; k < t; k++) {
            plans[i].coverages[j].deductible[k].default = k + 1 === t;
          }
        }
      }
    }
    return plans;
  }

  componentDidMount() {
    const { inmueble } = this.props;
    this.getPlans(inmueble).catch((e) => {
      this.setState({ errorRateCalculated: true, typeError: 1 });
      Loading.toggle(false);
    });
  }

  componentWillReceiveProps({ inmueble }) {
    const entries = this.getItems();
    const different = entries.some(
      ([key]) => this.props.inmueble[key] !== inmueble[key]
    );
    const valid = this.isValid(inmueble);
    const change = valid !== this.isValid(this.props.inmueble);
    if (different || (valid && (!this.planLoaded || change)))
      this.updateType(inmueble);
  }

  getType({ contenidoasegudado, inmuebleasegudado }) {
    let type = 3;
    if (inmuebleasegudado === 0 && contenidoasegudado === 1) type = 2;
    else if (inmuebleasegudado === 1 && contenidoasegudado === 0) type = 1;
    return type;
  }

  updateType(newInmueble) {
    this.getPlans(newInmueble).catch((e) => {
      Loading.toggle(false);
      this.setState({ errorRateCalculated: true, typeError: 2 });
    });
  }

  handleRetry = () => {
    this.setState(
      (prevState) => {
        const newRetryCount = prevState.retryCount + 1;
        const retryLimitReached = newRetryCount >= 4;

        return {
          retryCount: newRetryCount,
          retryLimitReached,
          showButtonReturn: retryLimitReached,
        };
      },
      async () => {
        if (!this.state.retryLimitReached) {
          this.getPlans(this.props.inmueble)
            .then(() => {
              this.setState({ errorRateCalculated: false });
            })
            .catch((e) => {
              Loading.toggle(false);
            });
        }
      }
    );
  };

  async getPlans(inmueble = null) {
    if (!this.isValid(inmueble)) return;
    Loading.toggle(true);
    const type = this.getType(inmueble);
    const quotateId = this.props.match.params.id;
    const plansLoaded = this.planLoaded;
    this.planLoaded = true;
    let plans = await AllPlans.get({
      type,
      quoteId: store.getState().cotizacion.number,
    });
    let plan =
      !plansLoaded &&
      (await QuoteIussedById.get(quotateId).catch((e) => {
        this.planLoaded = false;
        throw e;
      }));

    let indexSelected = null;

    let selected = plan && plan.plan_selected_info.Item;
    if (selected && !plansLoaded) {
      indexSelected = parseInt(selected['assists'][0]['selected_id']);
      const mappedPlan = Coberturas.setHiredCoverages(
        plans[indexSelected],
        inmueble
      );
      plans[indexSelected] = Tab.assignValuesSaved(selected, mappedPlan);
      plans[indexSelected] = BtnContinue.toNumberCoverrange(
        plans[indexSelected]
      );
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
          // eslint-disable-next-line no-loop-func
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

    const inspect = await Cards.getDataFromInspectionPolicy();
    if (inspect !== false) {
      if (inspect[1] === 'IC') {
        //Is IC alter dedutibles of plan.
        plans = Tab.setMaxDedutibles(plans);
      }
    }

    this.setState({
      ...this.state,
      plans: plans,
    });
    store.dispatch(AllPlansCreator(plans));
    Loading.toggle(false);
  }

  render() {
    const { indexPlan } = this.props;
    const { plans, errorRateCalculated, typeError } = this.state;

    const stepCotizacion = store.getState().cotizacion.state;
    const cotizacionNumber = store.getState().cotizacion.number;
    moment.locale('es');
    const currentDateTime = moment().format('DD/MMM/YYYY HH:mm:ss');

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
        <ModalLimitsPlanError
          open={errorRateCalculated}
          onRetry={this.handleRetry}
          code={500} //TODO: cambiar según el servicio, por defecto 500
          stepCotizacion={stepCotizacion}
          numberCotizacion={cotizacionNumber}
          showButtonReturn={this.state.showButtonReturn}
          currentDateTime={currentDateTime}
          firstCode={typeError === 2 ? 3 : 4} //TODO: cambiar según el servicio, debería traer un 4, por defecto 5
        />
      </Fragment>
    );
  }
}

export default withRouter(
  connect(({ indexPlan, Inmueble }) => {
    return { indexPlan, inmueble: Inmueble };
  })(Tab)
);
