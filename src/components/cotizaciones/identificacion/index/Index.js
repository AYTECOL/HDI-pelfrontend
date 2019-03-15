import React from 'react';

//Component
import TipoDocumento from '../../../globals/forms/identificacion/tipodocumento/TipoDocumento';
import NumeroIdentificacion from '../../../globals/forms/identificacion/numeroidentificacion/NumeroIdentificacion';
import BtnContinue from '../../../globals/forms/identificacion/btncontinue/BtnContinue';

import SecondForm from '../secondform/SecondForm';

import store from '../../../../store';
<<<<<<< HEAD
=======
import {
    loadIdentifications,
    validateIdentificationValue,
    saveIdentificationValue,
    nextStepIndex,
    setAddresMap,
    reqAddres
} from '../../../../actionCreators';
>>>>>>> 996af23... [PELH-2.2] Send google places request

import './Index.scss';
import {Link} from "react-router-dom";
import Mapa from "../../../mapa/Mapa.js"

<<<<<<< HEAD
class Index extends React.Component {
=======
store.dispatch(loadIdentifications());

<<<<<<< HEAD
const Index = ({stateForm, identifications, autoCompleteCuidad, cotizacion, cotizacionErrors, continueButtonDisable, autoCompleteCiudadToogle, saveIdentificationValue, validateIdentificationValue, nextStepIndex, mapsOptions}) => {
=======
const Index = ({stateForm, identifications, autoCompleteCuidad, cotizacion, cotizacionErrors, continueButtonDisable, saveIdentificationValue, validateIdentificationValue, nextStepIndex, setAddresMap,  reqAddres}) => {
>>>>>>> 996af23... [PELH-2.2] Send google places request
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
<<<<<<< HEAD
                            <NumeroIdentificacion/>
=======
                            <div className={"form-group " + cotizacionErrors.identification_address}>
                                <label htmlFor="address">Dirección del hogar</label>
                                <input name="address" id="address" type="text" className="form-control"
                                       placeholder="Ingresa la dirección"
                                       onChange={(e) => {
                                           reqAddres(e.target);
                                           validateIdentificationValue(e.target.name);
                                       }}/>
                                <small className="form-text text-muted">Ejemplo: Calle 143Bis # 23 a 34</small>
                            </div>
                        </div>

                        <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                            <div className={"form-group " + cotizacionErrors.identification_addressadditional}>
                                <label htmlFor="addressadditional">Ingresa información adicional (opcional)</label>
                                <input name="addressadditional" id="addressadditional" type="text"
                                       className="form-control"
                                       placeholder="Ingresa la dirección"
                                       onChange={(e) => {
                                           saveIdentificationValue(e.target);
                                           validateIdentificationValue(e.target.name);
                                       }}/>
                                <small className="form-text text-muted"> Ejemplo: Interior 6, apto 201</small>
                            </div>
>>>>>>> 996af23... [PELH-2.2] Send google places request
                        </div>
                    </div>

<<<<<<< HEAD
                    <SecondForm />

                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                            <BtnContinue/>
=======
                </div>
                {/* <button type="button" className="btn btn-primary" onClick={() => {mapsOptions.options.zoom = mapsOptions.options.zoom +1;console.log(mapsOptions); setAddresMap(mapsOptions)}}>+</button>
                <button type="button" className="btn btn-primary">-</button> */}

                <Mapa />                   
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
        continueButtonDisable: state.continueButtonDisable
    };
};
>>>>>>> 2ca8784... [PEL-2.4]Startup Maps component

<<<<<<< HEAD
=======
const mapDispatchToProps = dispatch => {
    return {
        saveIdentificationValue(value) {
            dispatch(saveIdentificationValue(value));
        },
        validateIdentificationValue(cotizacion) {
            dispatch(validateIdentificationValue(cotizacion));
        },
        nextStepIndex() {
            dispatch(nextStepIndex());
        },
        setAddresMap(mapa) {
            dispatch(setAddresMap(mapa));
        },
        reqAddres(value) {
            dispatch(reqAddres(value));
        },
    };
>>>>>>> 996af23... [PELH-2.2] Send google places request
};

export default Index;