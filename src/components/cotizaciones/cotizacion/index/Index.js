import React from 'react';
import './Index.scss';
import {withRouter} from "react-router-dom";
//Component
import SendMail from "../popups/sendmail/SendMail";
import Cards from "../cards/Cards";
import Tab from "../tab/Tab";
import Btns from "../forms/btncontinue/BtnContinue";
import Links from "../forms/links/Links";
import store from "../../../../store";
import {indexPlanSelected} from "../../../../actions";

class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
            plans: [],
            index: 1,
        };
        for (let i = 0; i < 3; i++) {
            this.state.plans[i] = {name: "------"}
        }

        store.subscribe(async () => {
            let storeState = store.getState();
            let plans = storeState.AllPlans;
            let index = storeState.indexPlan;
            if (plans.length !== 0 || this.state.index !== index) {
                this.setState({
                    ...this.state,
                    plans: plans,
                    index: index
                });
            }
        });
    }

    changeIndexPlan(index) {
        store.dispatch(indexPlanSelected(index));
    }

    render() {
        if (this.state.step !== 3) return <div className="hide">&nbsp;</div>;
        return (
            <form autoComplete="off" className="index-form contizacion-form">
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 title">
                            <h2>Tu cotización</h2>
                            <p>Listo, selecciona e ingresa un valor para los items que deseas asegurar</p>
                        </div>
                    </div>

                    <Cards/>

                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 title">
                            <p>Listo, te sugerimos un paquete recomendado, sin embargo puedes personalizarlo de acuerdo
                                a la necesidad, quita o agrega lo que consideras podría ser de utilidad en el futuro</p>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col col-sm-12 col-md-10 col-lg-10">
                            <div className="tool-tip info tool-tip-new">
                                <p>Póliza sujeta a <span>inspección en sitio</span></p>
                                <div className="more-info">
                                    <p>Más información</p>
                                    <div className="span">
                                        <span>?</span>
                                        <div className="text">La vivienda requiere que la revisemos más al detalle, si
                                            deseas emitir la póliza agendaremos una futura inspección. Ten presente los
                                            siguientes datos: nombre de contacto y teléfono de contacto:
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row tabs text-center">
                        {this.state.plans.map((option, key) =>
                            <div className="col col-12 col-sm-12 col-md-4 col-lg-4 no-padding" key={key}>
                                <div className={"item-tab " + (this.state.index === key ? 'active' : '')}
                                     onClick={(e) => {
                                         this.changeIndexPlan(key);
                                     }}>
                                    <span>{option.name}</span>
                                    <p>$ 000.000</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="tabs-header text-center">
                        <Tab/>
                    </div>

                    <div className="row">
                        <div
                            className="col col-12 col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                            <Links/>
                        </div>
                    </div>

                    <div className="row btns-bottom">
                        <div
                            className="col col-12 col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                            <Btns/>
                        </div>
                    </div>

                    <div className="row alert-contizacion">
                        <div
                            className="col col-12 col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                            <p><i>i</i>No olvides diligenciar el SARLAFT, si aún no lo tienes descarga el
                                fotmato <span>aquí</span></p>
                        </div>
                    </div>

                </div>
                <SendMail/>
            </form>
        )
    }

}

export default withRouter(Index);