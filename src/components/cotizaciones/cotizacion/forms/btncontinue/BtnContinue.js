import React, {Component, Fragment} from 'react';

import Helpers from "../../../../../common/helpers/helpers/Helpers";
import {withRouter} from "react-router-dom";
import {UrlSite} from "../../../../../config";
import NewPlanSelected from "../../../../../services/NewPlanSelected";
import store from "../../../../../store";
import CreateOrUpdateValoration from "../../../../../services/CreateOrUpdateValoration";
import Loading from "../../../../globals/loading/Loading";
import Masknumbermoney from "../../../../../common/helpers/masknumbermoney/Masknumbermoney";
import {NextStep, saveProspect} from "../../../../../actions";
import SaveIdentifications from "../../../../../services/Quote";
import Links from "../links/Links";

class BtnContinue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            continueButtonDisable: true,
            stateFormIdentificacion: 0,
            cotizacionExclude: [],
        };
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

        store.dispatch(saveProspect(plan['prima']));

        await Links.pdf(this, false);

        store.dispatch(NextStep(4));
        await SaveIdentifications.save();
        await CreateOrUpdateValoration.save();
        await NewPlanSelected.get(plan);
        this.props.history.push(UrlSite + "/emision/1/" + this.props.match.params.id);
        Loading.toggle(false);
    };

    saveAndExit = () => {
        Helpers.goToHome(this.props.history);
    };

    goBack = async () => {
        Loading.toggle(true);
        await CreateOrUpdateValoration.save();
        this.props.history.push(UrlSite + "/cotizacion/2/" + this.props.match.params.id);
    };

    render() {
        return (
            <Fragment>
                <div className="return-button">
                    <button className="btn btn-link" type="button" onClick={this.goBack}><i
                        className="back-icon">&nbsp;</i>Volver
                    </button>
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
