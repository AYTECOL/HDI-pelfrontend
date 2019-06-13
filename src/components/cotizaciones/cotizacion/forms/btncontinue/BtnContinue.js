import React, {Component, Fragment} from 'react';

import Helpers from "../../../../../common/helpers/helpers/Helpers";
import {withRouter} from "react-router-dom";
import {UrlSite} from "../../../../../config";
import NewPlanSelected from "../../../../../services/NewPlanSelected";
import store from "../../../../../store";
import CreateOrUpdateValoration from "../../../../../services/CreateOrUpdateValoration";
import Loading from "../../../../globals/loading/Loading";
import Masknumbermoney from "../../../../../common/helpers/masknumbermoney/Masknumbermoney";

class BtnContinue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            continueButtonDisable: true,
            stateFormIdentificacion: 0,
            cotizacionExclude: [],
            step: parseInt(this.props.match.params.step),
            id: this.props.match.params.id,
            comeBack: UrlSite + "/cotizacion/2/"
        };
        this.state.comeBack += this.state.id;
    }

    static toNumberCoverrange(plan) {
        for (let i = 0; i < plan.coverages.length; i++) {
            if (typeof plan.coverages[i].values !== "undefined") {
                for (let j = 0; j < plan.coverages[i].values.length; j++) {
                    let v = plan.coverages[i].values[j].value_show;
                    if (typeof v !== "undefined") {
                        plan.coverages[i].values[j].value_to_quotate = Masknumbermoney.formatToNumber(v);
                    } else {
                        plan.coverages[i].values[j].value_to_quotate = 0;
                    }
                }
            }
        }
        return plan;
    }

    nextStep = async () => {
        Loading.toggle(true);
        let storeState = store.getState();
        let plans = storeState.AllPlans;
        let index = storeState.indexPlan;
        let plan = plans[index];
        plan['prospect'] = 2;
        plan['quote_id'] = this.props.match.params.id;
        plan['assists'][0]['selected_id'] = index;

        plan = BtnContinue.toNumberCoverrange(plan);

        await CreateOrUpdateValoration.save();
        await NewPlanSelected.get(plan);
        window.location.href = UrlSite + "/emision/1/" + this.state.id;
        Loading.toggle(false);
    };

    saveAndExit = () => {
        Helpers.goToHome();
    };

    render() {
        return (
            <Fragment>
                <div className={"return-button"}>
                    <a href={this.state.comeBack}><i className="back-icon">&nbsp;</i>Volver</a>
                </div>
                <button type="button" className={"btn btn-default"}
                        onClick={this.saveAndExit}>Guardar y salir
                </button>
                <button type="button" className={"btn btn-primary next-step"}
                        onClick={this.nextStep}>Iniciar emisión
                </button>
            </Fragment>
        );
    }
}

export default withRouter(BtnContinue);
