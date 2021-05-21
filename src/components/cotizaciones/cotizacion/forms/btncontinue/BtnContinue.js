import React, { Component, Fragment } from "react";
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { withRouter } from "react-router-dom";

import Helpers from "../../../../../common/helpers/helpers/Helpers";
import { UrlSite } from "../../../../../config";
import NewPlanSelected from "../../../../../services/NewPlanSelected";
import store from "../../../../../store";
import CreateOrUpdateValoration from "../../../../../services/CreateOrUpdateValoration";
import Loading from "../../../../globals/loading/Loading";
import Masknumbermoney from "../../../../../common/helpers/masknumbermoney/Masknumbermoney";
import { NextStep, resetStore, saveProspect } from "../../../../../actions";
import SaveIdentifications from "../../../../../services/Quote";
import Links from "../links/Links";
import "./btncontinue.scss";
import Coberturas from '../../coberturas/Coberturas';
import { getItems } from "../../cards/getItems";


class BtnContinue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      continueButtonDisable: true,
      stateFormIdentificacion: 0,
      cotizacionExclude: [],
      msgErrorInspect: "",
      buttonState: false
    };
  }

  static toNumberCoverrange(plan) {
    if (typeof plan !== "undefined") {
      for (let i = 0; i < plan.coverages.length; i++) {
        if (typeof plan.coverages[i].values !== "undefined") {
          for (let j = 0; j < plan.coverages[i].values.length; j++) {
            let v = plan.coverages[i].values[j].value_show;
            if (v === "N/A") v = plan.coverages[i].values[j].value;
            if (typeof plan.coverages[i].values[j].values !== "undefined") {
              let value = 0;
              let values = plan.coverages[i].values[j].values;
              for (let k = 0; k < values.length; k++) {
                if (values[k].default === true) {
                  value = Masknumbermoney.formatToNumber(values[k].limit);
                }
              }
              plan.coverages[i].values[j].value_to_quotate = value;
            } else {
              if (typeof v !== "undefined") {
                plan.coverages[i].values[
                  j
                ].value_to_quotate = Masknumbermoney.formatToNumber(v);
              } else {
                plan.coverages[i].values[j].value_to_quotate = 0;
              }
            }
          }
        }
      }
    }
    return plan;
  }

  planToSave() {
    let storeState = store.getState();
    let plans = storeState.AllPlans;
    let index = storeState.indexPlan;
    let plan = plans[index];
    plan["premium_after_all_the_rules"] =
      plan.prima.premium_after_all_the_rules;
    plan["calculation_of_pure_extra_shelter_premium"] =
      plan.prima.calculation_of_pure_extra_shelter_premium;
    plan["prospect"] = plan.value;
    plan["quote_id"] = this.props.match.params.id;
    plan["assists"][0]["selected_id"] = index;

    plan = BtnContinue.toNumberCoverrange(plan);
    store.dispatch(saveProspect(plan["prima"]));
    return plan;
  }

  nextStep = async () => {
    Loading.toggle(true);
    try {
      let plan = this.planToSave();
      let dataStore = store.getState();
      let inspectType = dataStore.Inmueble.inspection_policies;
      switch (inspectType) {
        case "RF":
          this.setState({
            msgErrorInspect:
              "Cotización sujeta a registro fotográfico, contacte a su gestor"
          });
          this.setState({ buttonState: false });
          Loading.toggle(false);
          return;
        case "IC":
          this.setState({
            msgErrorInspect:
              "Cotización sujeta a inspección, contacte a su gestor"
          });
          this.setState({ buttonState: false });
          Loading.toggle(false);
          return;
        default:
      }
      await Links.pdf(this, false);

      store.dispatch(NextStep(4));
      await SaveIdentifications.save();
      await CreateOrUpdateValoration.save();
      await NewPlanSelected.get(plan);
      this.props.history.push(
        UrlSite + "/emision/1/" + this.props.match.params.id
      );
      Loading.toggle(false);
    } catch (e) {
      Loading.toggle(false);
    }
  };

  saveAndExit = async () => {
    Loading.toggle(true);
    try {
      let plan = this.planToSave();
      await NewPlanSelected.get(plan);
    } catch (e) {
      Loading.toggle(false);
    }
    Helpers.goToHome(this.props.history);
  };

  goBack = async () => {
    Loading.toggle(true);
    store.dispatch(NextStep(2));
    await SaveIdentifications.save();
    await CreateOrUpdateValoration.save();
    store.dispatch(resetStore());
    this.props.history.push(
      UrlSite + "/cotizacion/2/" + this.props.match.params.id
    );
  };

  render() {
    const { disabled } = this.props;
    return (
      <Fragment>
        <div className="msj-total">
          <p>{this.state.msgErrorInspect}</p>
        </div>

        <div className="return-button div-format">
          <button className="btn btn-link" type="button" onClick={this.goBack}>
            <i className="back-icon">&nbsp;</i>Volver
          </button>
        </div>
        <button
          type="button"
          className={'btn btn-default'}
          onClick={this.saveAndExit}
        >
          Guardar y salir
        </button>
        <button
          disabled={this.state.buttonState || disabled}
          type="button"
          className={classNames('btn btn-primary', !disabled && 'next-step')}
          onClick={this.nextStep}
        >
          Iniciar emisión
        </button>
      </Fragment>
    );
  }
}

export default compose(
  withRouter,
  connect(({ AllPlans, indexPlan, Inmueble }) => {
    const plan = AllPlans[indexPlan];
    const items = getItems();
    const hasError = () => {
      try {
        const errorInmueble = items.some(({ parent }) => {
          if (Inmueble && Inmueble[parent.nameModel]) {
            const error = parent.validateField(Inmueble[parent.nameModelValue]);
            if (error) return true;
          }
          return false;
        });
        if (errorInmueble) return true;

        let coveragesValid = true;
        if (plan) {
          if (!plan.value) return true;
          coveragesValid = !plan.coverages.some(
            ({ values }, k) =>
              values &&
              values.some((value) => {
                const errors = !!Coberturas.getErrorsCoverage(
                  plan,
                  value,
                  k,
                  value.values ? 2 : 1
                );
                return errors && !!errors.length;
              })
          );
        } else return true;
        return !coveragesValid;
      } catch (error) {
        return false;
      }
    };
    return { disabled: hasError() };
  })
)(BtnContinue);
