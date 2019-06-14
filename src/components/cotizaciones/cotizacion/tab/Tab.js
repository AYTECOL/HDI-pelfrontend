import React, {Component, Fragment} from 'react';
import './Tab.scss';
import {withRouter} from "react-router-dom";
import AllPlans from '../../../../services/AllPlans';
import Helpers from "../../../../common/helpers/helpers/Helpers";
import store from "../../../../store";
import {AllPlans as AllPlansCreator, indexPlanSelected} from "../../../../actions";
//Components
import Coberturas from '../coberturas/Coberturas';
import Asistencias from '../asistencias/Asistencias';
import Loading from "../../../globals/loading/Loading";
import QuoteIussedById from "../../../../services/QuoteIussedById";
import DeterminePolizaPrima from "../../../../services/DeterminePolizaPrima";
import BtnContinue from '../forms/btncontinue/BtnContinue';

class Tab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
            plans: [],
            Inmueble: {},
            typePlans: 3,
            index: "",
            quotationId: store.getState().cotizacion.number
        };
        store.subscribe(() => {
            let storeState = store.getState();
            let inmueble = storeState.Inmueble;
            let indexPlan = storeState.indexPlan;
            if (inmueble.inmuebleasegudado !== this.state.Inmueble.inmuebleasegudado ||
                inmueble.contenidoasegudado !== this.state.Inmueble.contenidoasegudado
            ) {
                this.updateType();
            }
            if (this.state.index !== indexPlan) {
                this.setState({
                    ...this.state,
                    index: indexPlan
                });
            }
        });
    }

    componentDidMount() {
        Loading.toggle(true);
    }

    updateType() {
        let inmueble = store.getState().Inmueble;
        let type = this.state.typePlans;
        if (inmueble.inmuebleasegudado === 1 && inmueble.contenidoasegudado === 1) {
            type = 3;
        } else if (inmueble.inmuebleasegudado === 0 && inmueble.contenidoasegudado === 1) {
            type = 2;
        } else if (inmueble.inmuebleasegudado === 1 && inmueble.contenidoasegudado === 0) {
            type = 1;
        }
        if (typeof this.state.Inmueble.inmuebleasegudado !== "undefined") {
            setTimeout(() => {
                this.getPlants();
            }, 4);
        }
        this.setState({
            ...this.state,
            Inmueble: inmueble,
            typePlans: type,
        });
    }

    async getPlants() {
        const quotateId = this.state.quotationId;
        let plans = await AllPlans.get(this.state.typePlans);
        let plan = await QuoteIussedById.get(this.props.match.params.id);
        for (let i = 0; i < plans.length; i++) {
            let currentPlan = Coberturas.calcValue(plans, i);
            currentPlan = BtnContinue.toNumberCoverrange(plans[i]);
            let prospect = await DeterminePolizaPrima.get(currentPlan, quotateId);
            plans[i].value = prospect.prospect;
        }

        if (typeof plan.plan_selected_info.Item !== "undefined") {
            let selected = plan.plan_selected_info.Item;
            let indexSelected = selected['assists'][0]['selected_id'];
            store.dispatch(indexPlanSelected(indexSelected));
        } else {
            if (this.state.index === "") for (let i in plans) {
                if (plans[i].isdefault === true) {
                    store.dispatch(indexPlanSelected(i));
                }
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
        if (typeof this.state.plans[this.state.index] === "undefined") return <div className="hide">&nbsp;</div>;
        return (
            <Fragment>
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
                    <Coberturas toggleSlide={Helpers.toggleSlide}/>
                    <Asistencias toggleSlide={Helpers.toggleSlide}/>
                </div>
            </Fragment>
        )
    }

}

export default withRouter(Tab);
