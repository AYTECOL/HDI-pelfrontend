import React, {Component} from 'react';

import store from '../../../../../store';
import {NextStep, nextStepIndentification} from '../../../../../actionCreators';
import SaveIdentifications from '../../../../../services/SaveIdentifications';
import {Link, withRouter} from "react-router-dom";

class BtnContinue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            continueButtonDisable: true,
            stateFormIdentificacion: 0,
            cotizacionExclude: [],
        };

        store.subscribe(() => {
            let storeState = store.getState();
            let stateForm = storeState.stateFormIdentificacion;
            let typeDoc = storeState.typeDocument;
            if (stateForm === 1) {
                if (typeDoc === 2) {
                    this.state.cotizacionExclude.push("name");
                    this.state.cotizacionExclude.push("lastname");
                    this.state.cotizacionExclude.push("addressadditional");
                    this.state.cotizacionExclude.pop(this.state.cotizacionExclude.indexOf("businessname"));
                } else {
                    this.state.cotizacionExclude.pop(this.state.cotizacionExclude.indexOf("name"));
                    this.state.cotizacionExclude.pop(this.state.cotizacionExclude.indexOf("lastname"));
                    this.state.cotizacionExclude.push("businessname");
                    this.state.cotizacionExclude.push("addressadditional");
                }
                let i = 0;
                for (let item in storeState.cotizacion.identification) {
                    if (storeState.cotizacion.identification[item] === "" && this.state.cotizacionExclude.indexOf(item) === -1) {
                        i++;
                    }
                }
                if (i === 0) {
                    storeState.continueButtonDisable = false;
                } else {
                    storeState.continueButtonDisable = true;
                }
            }
            if (
                this.state.continueButtonDisable !== storeState.continueButtonDisable ||
                this.state.stateFormIdentificacion !== storeState.stateFormIdentificacion
            ) {
                this.setState({
                    ...this.state,
                    continueButtonDisable: storeState.continueButtonDisable,
                    stateFormIdentificacion: storeState.stateFormIdentificacion,
                });
            }
            console.log(storeState.cotizacion.state);
        });
    }

    nextStepIndex() {
        let storeState = store.getState();
        switch (this.state.stateFormIdentificacion) {
            case 0:
            default:
                store.dispatch(nextStepIndentification());
                break;
            case 1:
                store.dispatch(NextStep(2));
                SaveIdentifications.save();
                this.props.history.push('/cotizacion/2/' + storeState.cotizacion.number);
                break;
        }
    }

    saveAndExit() {
        SaveIdentifications.save();
        window.location.href = "/";
    }

    render() {
        return (
            <div>
                <div className={(this.state.stateFormIdentificacion !== 1 ? "hide " : "") + " return-button"}>
                    <Link to='/'><i className="back-icon"></i>Volver</Link>
                </div>
                <button className={(this.state.stateFormIdentificacion !== 1 ? "hide " : "") + " btn btn-default"}
                        onClick={() => this.saveAndExit()} type="button">Guardar y salir
                </button>
                <button disabled={this.state.continueButtonDisable} onClick={() => this.nextStepIndex()}
                        type="button"
                        className={(this.state.continueButtonDisable ? 'disabled ' : '') + "btn btn-primary"}>Continuar
                </button>
            </div>
        );
    }
}

export default withRouter(BtnContinue);



