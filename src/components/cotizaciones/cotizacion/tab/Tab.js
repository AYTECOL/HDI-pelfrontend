import React, {Component, Fragment} from 'react';
import './Tab.scss';
import {withRouter} from "react-router-dom";
import AllPlans from '../../../../services/AllPlans';
import Helpers from "../../../../common/helpers/helpers/Helpers";
import store from "../../../../store";
import {AllPlans as AllPlansCreator, indexPlanSelected} from "../../../../actions";
import Masknumbermoney from "../../../../common/helpers/masknumbermoney/Masknumbermoney";
//Components
import Coberturas from '../coberturas/Coberturas';
import Asistencias from '../asistencias/Asistencias';
import Loading from "../../../globals/loading/Loading";
import QuoteIussedById from "../../../../services/QuoteIussedById";
import DeterminePolizaPrima from "../../../../services/DeterminePolizaPrima";

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
    }

    componentDidMount() {
        Loading.toggle(true);
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
        this.setState({
            ...this.state,
            Inmueble: inmueble,
            typePlans: type,
        });
        setTimeout(() => {
            this.getPlants();
        }, 4);
    }

    assignValuesSaved(selected, normal){
        for (let j = 0; j < normal.coverages.length; j++) {
            normal.coverages[j].optional = selected.coverages[j].optional;
        }
        for (let j = 0; j < normal.assists.length; j++) {
            normal.assists[j].optional = selected.assists[j].optional;
            for (let k = 0; k < normal.assists[j].values.length; k++) {
                normal.assists[j].values[k].optional = selected.assists[j].values[k].optional;
                for (let l = 0; l < normal.assists[j].values[k].assists.length; l++) {
                    normal.assists[j].values[k].assists[l].optional = selected.assists[j].values[k].assists[l].optional;
                }
            }
        }
        return normal;
    }

    getValueFields(item) {
        try {
            let inmueble = store.getState().Inmueble;
            // Inmueble
            if (item.id === 1) {
                return Masknumbermoney.formatToMask(
                    Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadovalor) * parseInt(item.value) / 100);
                //Contenidos
            } else if (item.id === 2) {
                return Masknumbermoney.formatToMask(
                    Masknumbermoney.formatToNumber(inmueble.contenidoasegudadovalor) * parseInt(item.value) / 100);
                //Obras
            } else if (item.id === 3) {
                return Masknumbermoney.formatToMask(
                    Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadoobrasvalor) * parseInt(item.value) / 100);
                //Telefonos moviles
            } else if (item.id === 4) {
                return Masknumbermoney.formatToMask(
                    Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadotelefonosvalor) * parseInt(item.value) / 100);
                //Hurto siempre basado en hurto calificado
            } else if (item.id === 5) {
                let dataHurto = [];
                let hurto = this.getCoverangeById(3);
                for (let i = 0; i < hurto.values.length; i++) dataHurto.push(this.getValueFields(hurto.values[i]));
                return Masknumbermoney.formatToMask(
                    (Masknumbermoney.formatToNumber(dataHurto[0]) + Masknumbermoney.formatToNumber(dataHurto[1])) * parseInt(item.value) / 100);
                //Joyas
            } else if (item.id === 6) {
                return Masknumbermoney.formatToMask(
                    Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadojoyasvalor) * parseInt(item.value) / 100);
                //Contenido mobile
            } else if (item.id === 7) {
                let joyas = Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadojoyasvalor) * 100 / 100;
                let contenido = Masknumbermoney.formatToNumber(inmueble.contenidoasegudadovalor) * 10 / 100;
                let telefonos = Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadotelefonosvalor) * 100 / 100;
                return Masknumbermoney.formatToMask(
                    (joyas + contenido + telefonos) * parseInt(item.value) / 100);
            }
            return 'N/A';
        } catch (e) {
            return 'N/A';
        }
    }
    calcValue(plans, index) {
        if (typeof plans[index] === "undefined") return;
        if (typeof plans[index] === "undefined") return;
        if (typeof plans[index].coverages === "undefined") return;
        for (let i = 0; i < plans[index].coverages.length; i++) {
            let d = plans[index].coverages[i].values;
            if (typeof d !== "undefined") {
                for (let j = 0; j < d.length; j++) {
                    if (typeof d[j].value !== "undefined") {
                        plans[index].coverages[i].values[j].value_show = this.getValueFields(d[j]);
                    }
                    else {
                       for (let limit = 0; limit <  d[j].values.length; limit ++) {
                           if(d[j].values[limit].default === true){
                            plans[index].coverages[i].values[j].value = d[j].values[limit].limit;
                            plans[index].coverages[i].values[j].value_show = this.getValueFields(d[j]);
                           }
                       }
                    }
                }
            }
        }
        return plans;
    }
    toNumberCoverrange(plan) {
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
    async getPlants() {
        const quotateId = this.state.quotationId;
        let plans = await AllPlans.get(this.state.typePlans);
        let plan = await QuoteIussedById.get(this.props.match.params.id);
        for(let i = 0; i < plans.length; i++){
             let currentPlan = this.calcValue(plans, i);
            currentPlan = this.toNumberCoverrange(plans[i]); 
            let prospect = await DeterminePolizaPrima.get(currentPlan, quotateId);
            plans[i].value = prospect.prospect;
        }
       
        
        if (typeof plan.plan_selected_info.Item !== "undefined") {
            let selected = plan.plan_selected_info.Item;
            let indexSelected = selected['assists'][0]['selected_id'];
                // selected = this.toNumberCoverrange(plans[indexSelected]);
                store.dispatch(indexPlanSelected(indexSelected));
        } else {
            if (this.state.index === "") for (let i in plans){
                
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
