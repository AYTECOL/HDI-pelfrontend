import React from 'react';
import './Tab.scss';
import {withRouter} from "react-router-dom";
import AllPlans from '../../../../services/AllPlans';
import Helpers from "../../../../common/helpers/helpers/Helpers";
import store from "../../../../store";
import {indexPlanSelected, toggleLoading} from "../../../../actions";

//Components
import Coberturas from '../coberturas/Coberturas';
import Asistencias from '../asistencias/Asistencias';

class Tab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
            plans: [],
            Inmueble: store.getState().Inmueble,
            typePlans: 3,
            index: 0
        };
        store.dispatch(toggleLoading(true));
        store.subscribe(() => {
            let storeState = store.getState();
            let inmueble = storeState.Inmueble;
            let indexPlan = storeState.indexPlan;
            if ( inmueble.inmuebleasegudado !== this.state.Inmueble.inmuebleasegudado ||
                 inmueble.contenidoasegudado !== this.state.Inmueble.contenidoasegudado
            ) {
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
                    typePlans: type,
                    Inmueble: inmueble
                });
                setTimeout(function () {
                    this.getPlants();
                }.bind(this),4);
            }
            if (this.state.index !== indexPlan){
                this.setState({
                    ...this.state,
                    index: indexPlan
                });
            }
        });
    }

    async getPlants() {
        let plans = await AllPlans.get(this.state.typePlans);
        this.setState({
            ...this.state,
            plans: plans,
        });
        for(let i in plans) if (plans[i].isdefault) store.dispatch(indexPlanSelected(i));
    }

    toogleSlide(index) {
        let className = "close_item";
        if (Helpers.hasClass(".row_tab_" + index, className)) {
            Helpers.removeClass(".row_tab_" + index, className);
        } else {
            let el = document.querySelector(".row_tab_" + index + " .wrapper-box");
            el.style.height = el.offsetHeight + "px";
            Helpers.addClass(".row_tab_" + index, className);
        }
    }

    render() {
        if( typeof this.state.plans[this.state.index] === "undefined" ) return <div className="hide">&nbsp;</div>;
        return (
            <div>
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
                    <Coberturas toogleSlide={this.toogleSlide}/>
                    <Asistencias toogleSlide={this.toogleSlide}/>
                </div>
            </div>
        )
    }

}

export default withRouter(Tab);