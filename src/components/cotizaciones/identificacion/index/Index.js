import React from 'react';

//Component
import TipoDocumento from '../../../globals/forms/identificacion/tipodocumento/TipoDocumento';
import NumeroIdentificacion from '../../../globals/forms/identificacion/numeroidentificacion/NumeroIdentificacion';
import BtnContinue from '../../../globals/forms/identificacion/btncontinue/BtnContinue';

import SecondForm from '../secondform/SecondForm';

import store from '../../../../store';

import './Index.scss';
import {Link} from "react-router-dom";
import Mapa from "../../../mapa/Mapa.js"

<<<<<<< HEAD
class Index extends React.Component {
=======
store.dispatch(loadIdentifications());

const Index = ({stateForm, identifications, autoCompleteCuidad, cotizacion, cotizacionErrors, continueButtonDisable, autoCompleteCiudadToogle, saveIdentificationValue, validateIdentificationValue, nextStepIndex, mapsOptions}) => {
    return (
        <form autocomplete="off" className="index-form">
            <div className="container">
                <div className="row">
                    <div className="col col-sm-12 col-md-12 col-lg-12 title">
                        <h2>Comencemos</h2>
                        <p>Ingresa la siguiente información, así sabremos si es viable continuar con el proceso de
                            cotización</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                        <div className={"form-group input-select " + cotizacionErrors.identification_code}>
                            <label htmlFor="doc-type">Tipo de identificación</label>
                            <select disabled={(stateForm != 0 ? "disabled" : "")} name="code" id="doc-type"
                                    className={(stateForm != 0 ? "disabled " : "") + "form-control"}
                                    value={cotizacion.identification.code}
                                    onChange={(e) => {
                                        saveIdentificationValue(e.target);
                                        validateIdentificationValue(e.target.name);
                                    }}>
                                {identifications.identifications.map(identification =>
                                    <option key={identification.code}
                                            value={identification.code}>{identification.description}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                        <div className={"form-group " + cotizacionErrors.identification_value}>
                            <label htmlFor="doc-type-value">Número de identificación</label>
                            <input disabled={(stateForm != 0 ? "disabled" : "")} name="value" id="doc-type-value"
                                   type="text"
                                   className={(stateForm != 0 ? "disabled " : "") + "form-control"}
                                   placeholder="Ingresa la identificación"
                                   onChange={(e) => {
                                       saveIdentificationValue(e.target);
                                       validateIdentificationValue(e.target.name);
                                   }}/>
                            <small className="form-text only-errors">El número de Identificación ingresado, no
                                corresponde con el tipo de identificación seleccionado.
                            </small>
                        </div>
                    </div>
                </div>
>>>>>>> 2ca8784... [PEL-2.4]Startup Maps component

    constructor(props) {
        super(props);
        this.state = {
        };
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
                        <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                            <TipoDocumento/>
                        </div>
                        <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                            <NumeroIdentificacion/>
                        </div>
                    </div>

<<<<<<< HEAD
                    <SecondForm />

                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                            <BtnContinue/>
=======
                </div>
                <button type="button" className="btn btn-primary" onClick={() => {mapsOptions.options.zoom = mapsOptions.options.zoom +1}}>+</button>
                <button type="button" className="btn btn-primary">-</button>

                    <Mapa coords={mapsOptions}  />                   
                <div className="row">
                    <div className="col col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                        <div className={(stateForm != 1 ? "hide " : "") + "return-button"}>
                            <Link to='/'><i className="back-icon"></i>Volver</Link>
>>>>>>> 2ca8784... [PEL-2.4]Startup Maps component
                        </div>
                    </div>
                </div>
<<<<<<< HEAD
            </form>
        )
    }
=======
            </div>
        </form>
    );
};

const mapStateToProps = state => {
    return {
        autoCompleteCuidad: state.autoCompleteCuidad,
        stateForm: state.stateForm,
        identifications: state.identifications,
        cotizacion: state.cotizacion,
        cotizacionErrors: state.cotizacionErrors,
        continueButtonDisable: state.continueButtonDisable,
        mapsOptions: state.mapsOptions
    };
};
>>>>>>> 2ca8784... [PEL-2.4]Startup Maps component

};

export default Index;