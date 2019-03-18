import React, {Component} from 'react';

import store from '../../../../../store';
import {activeButtonContinue, nextStepIndentification} from '../../../../../actionCreators';
import SaveIdentifications from '../../../../../services/SaveIdentifications';
import {Link} from "react-router-dom";

class BtnContinue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            continueButtonDisable: true,
            additionalBtnsShow: false,
            stateFormIdentificacion: 0,
            cotizacionExclude: []
        };

        store.subscribe(() => {
            let storeState = store.getState();
            let stateForm = storeState.stateFormIdentificacion;
            let typeDoc = storeState.typeDocument;
            if ( stateForm == 1) {
                if ( typeDoc == 2 ) {
                    this.state.cotizacionExclude.push("name");
                    this.state.cotizacionExclude.push("lastname");
                    this.state.cotizacionExclude.push("addressadditional");
                    this.state.cotizacionExclude.pop(this.state.cotizacionExclude.indexOf("businessname"));
                }else{
                    this.state.cotizacionExclude.pop(this.state.cotizacionExclude.indexOf("name"));
                    this.state.cotizacionExclude.pop(this.state.cotizacionExclude.indexOf("lastname"));
                    this.state.cotizacionExclude.push("businessname");
                    this.state.cotizacionExclude.push("addressadditional");
                }
                let i = 0;
                for (let item in storeState.cotizacion.identification) {
                    if (storeState.cotizacion.identification[item] == "" && this.state.cotizacionExclude.indexOf(item) == -1 ) {
                        i++;
                    }
                }
                console.log(i);
                console.log(storeState.cotizacion.identification);
                if ( i == 0) {
                    storeState.continueButtonDisable = false;
                }else{
                    storeState.continueButtonDisable = true;
                }
            }
            this.setState({
                ...this.state,
                continueButtonDisable: storeState.continueButtonDisable,
                stateFormIdentificacion: storeState.stateFormIdentificacion,
            });
        });
    }

    nextStepIndex() {
        switch (this.state.stateFormIdentificacion) {
            case 0:
                store.dispatch(nextStepIndentification());
                break;
            case 1:
                console.log(2);
                SaveIdentifications.save();
                break;
        }
    }

    render() {
        return (
            <div>
                <div className={(!this.state.additionalBtnsShow ? "hide " : "") + " return-button"}>
                    <Link to='/'><i className="back-icon"></i>Volver</Link>
                </div>
                <button className={(!this.state.additionalBtnsShow ? "hide " : "") + " btn btn-default"}
                        onClick={() => this.nextStepIndex()} type="button">Guardar y salir
                </button>
                <button disabled={this.state.continueButtonDisable} onClick={() => this.nextStepIndex()}
                        type="button"
                        className={(this.state.continueButtonDisable ? 'disabled ' : '') + "btn btn-primary"}>Continuar
                </button>
            </div>
        );
    }
}

export default BtnContinue;



