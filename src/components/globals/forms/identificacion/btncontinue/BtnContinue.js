import React, { Component } from 'react';

import store from '../../../../../store';
import { activeButtonContinue, nextStepIndentification } from '../../../../../actionCreators';
import {Link} from "react-router-dom";

class BtnContinue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            continueButtonDisable: true,
            additionalBtnsShow: false,
        };

        store.subscribe(() => {
            let storeState = store.getState()
            this.setState({
                ...this.state,
                continueButtonDisable: storeState.continueButtonDisable,
            });
        });
    }

    nextStepIndex() {
        store.dispatch(nextStepIndentification());
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



