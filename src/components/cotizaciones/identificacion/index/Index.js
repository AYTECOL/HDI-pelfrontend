import React, {Component} from 'react';
//Component
import TipoDocumento from '../forms/tipodocumento/TipoDocumento';
import NumeroIdentificacion from '../forms/numeroidentificacion/NumeroIdentificacion';
import BtnContinue from '../forms/btncontinue/BtnContinue';

import SecondForm from '../secondform/SecondForm';

import './Index.scss';
import Loading from "../../../globals/loading/Loading";

class Index extends Component {
    componentDidMount() {
        Loading.toggle(true);
    }

    render() {
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

export default Index;