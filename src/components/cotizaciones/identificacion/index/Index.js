import React from 'react';
//Component
import TipoDocumento from '../../../globals/forms/identificacion/tipodocumento/TipoDocumento';
import NumeroIdentificacion from '../../../globals/forms/identificacion/numeroidentificacion/NumeroIdentificacion';
import BtnContinue from '../../../globals/forms/identificacion/btncontinue/BtnContinue';

import SecondForm from '../secondform/SecondForm';

import './Index.scss';
import {withRouter} from "react-router-dom";

class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
        };
    }

    render() {
        if (this.state.step !== 1) return <div></div>;
        return (
            <form autoComplete="off" className="index-form">
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 title">
                            <h2>Comencemos</h2>
                            <p>Ingresa la siguiente información, así sabremos si es viable continuar con el proceso de
                                cotización</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-12 col-sm-6 col-md-6 col-lg-6 form-first">
                            <TipoDocumento/>
                        </div>
                        <div className="col col-12 col-sm-6 col-md-6 col-lg-6 form-first">
                            <NumeroIdentificacion/>
                        </div>
                    </div>

                    <SecondForm/>

                    <div className="row">
                        <div
                            className="col col-12 col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                            <BtnContinue/>
                        </div>
                    </div>
                </div>
            </form>
        )
    }

}

export default withRouter(Index);