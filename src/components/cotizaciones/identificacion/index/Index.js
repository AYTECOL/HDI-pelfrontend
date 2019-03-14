import React from 'react';
import {connect} from "react-redux";

import store from '../../../../store';
import {
    loadIdentifications,
    validateIdentificationValue,
    saveIdentificationValue,
    autoCompleteCiudadToogle,
    nextStepIndex
} from '../../../../actionCreators';

import './Index.scss';
import {Link} from "react-router-dom";

store.dispatch(loadIdentifications());

const Index = ({stateForm, identifications, autoCompleteCuidad, cotizacion, cotizacionErrors, continueButtonDisable, autoCompleteCiudadToogle, saveIdentificationValue, validateIdentificationValue, nextStepIndex}) => {
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

                <div className={(stateForm != 1 ? "hide " : "")}>

                    <div className={(cotizacion.typeDocument != 1 ? "hide " : "") + "row"}>
                        <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                            <div className={"form-group " + cotizacionErrors.identification_name}>
                                <label htmlFor="name">Primer nombre</label>
                                <input name="name" id="name" type="text" className="form-control"
                                       placeholder="Ingresa primer nombre"
                                       onChange={(e) => {
                                           saveIdentificationValue(e.target);
                                           validateIdentificationValue(e.target.name);
                                       }}/>
                            </div>
                        </div>
                        <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                            <div className={"form-group " + cotizacionErrors.identification_lastname}>
                                <label htmlFor="lastname">Primer apellido</label>
                                <input name="lastname" id="lastnamee" type="text" className="form-control"
                                       placeholder="Ingresa primer apellido"
                                       onChange={(e) => {
                                           saveIdentificationValue(e.target);
                                           validateIdentificationValue(e.target.name);
                                       }}/>
                            </div>
                        </div>
                    </div>

                    <div className={(cotizacion.typeDocument != 2 ? "hide " : "") + "row"}>
                        <div className="col col-sm-12 col-md-12 col-lg-12 form-first">
                            <div className={"form-group " + cotizacionErrors.identification_name}>
                                <label htmlFor="businessname">Razón social</label>
                                <input name="businessname" id="businessname" type="text" className="form-control"
                                       placeholder="Ingresa la razón social"
                                       onChange={(e) => {
                                           saveIdentificationValue(e.target);
                                           validateIdentificationValue(e.target.name);
                                       }}/>
                            </div>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                            <div className={"form-group autocomplete " + cotizacionErrors.identification_city}>
                                <label htmlFor="city">Ciudad o municipio del hogar</label>
                                <input name="city" id="city" type="text" className="form-control"
                                       autoComplete="off"
                                       placeholder="Ingresa ciudad o municipio del h..."
                                       onBlur={(e) => {
                                           autoCompleteCiudadToogle();
                                       }}
                                       onFocus={(e) => {
                                           autoCompleteCiudadToogle();
                                       }}
                                       onChange={(e) => {
                                           saveIdentificationValue(e.target);
                                           validateIdentificationValue(e.target.name);
                                       }}/>
                                <small className="form-text only-errors">Por favor ingrese la Ciudad o Municipio del
                                    Hogar.
                                </small>
                                <ul className={(autoCompleteCuidad?'show':'hide') + " list-items"}>
                                    <li>hola</li>
                                    <li>hola</li>
                                    <li>hola</li>
                                    <li>hola</li>
                                    <li>hola</li>
                                    <li>hola</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                            <div className={"form-group " + cotizacionErrors.identification_address}>
                                <label htmlFor="address">Dirección del hogar</label>
                                <input name="address" id="address" type="text" className="form-control"
                                       placeholder="Ingresa la dirección"
                                       onChange={(e) => {
                                           saveIdentificationValue(e.target);
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
                        </div>
                    </div>

                </div>

                <div className="row">
                    <div className="col col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                        <div className={(stateForm != 1 ? "hide " : "") + "return-button"}>
                            <Link to='/'><i className="back-icon"></i>Volver</Link>
                        </div>
                        <button className={(stateForm != 1 ? "hide " : "") + "btn btn-default"}
                                onClick={() => nextStepIndex()} type="button">Guardar y salir
                        </button>
                        <button disabled={continueButtonDisable} onClick={() => nextStepIndex()}
                                type="button"
                                className={(continueButtonDisable ? 'disabled ' : '') + "btn btn-primary"}>Continuar
                        </button>
                    </div>
                </div>
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
        autoCompleteCiudadToogle(){
            dispatch(autoCompleteCiudadToogle());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);