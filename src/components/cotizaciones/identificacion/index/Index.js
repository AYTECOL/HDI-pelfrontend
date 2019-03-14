import React from 'react';
import {connect} from "react-redux";

import store from '../../../../store';
import {
    loadIdentifications,
    nextStepIndex,
    saveIdentificationType,
    saveIdentificationValue
} from '../../../../actionCreators';

import './Index.scss';
import {Link} from "react-router-dom";

store.dispatch(loadIdentifications());

const Index = ({stateForm, identifications, cotizacion, cotizacionErrors, saveIdentificationType, saveIdentificationValue, nextStepIndex}) => {
    return (
        <div className="index-form">
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
                                    defaultValue={cotizacion.identification.code}
                                    onChange={(e) => saveIdentificationType(e.target)}>
                                {identifications.identifications.map(identification =>
                                    <option selected={(cotizacion.identification.code == identification.code)?'selected':''} key={identification.code}
                                            value={identification.code}>{identification.description}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                        <div className={"form-group " + cotizacionErrors.identification_value}>
                            <label htmlFor="doc-type-value">Número de identificación</label>
                            <input disabled={(stateForm != 0 ? "disabled" : "")} name="value" id="doc-type-value" type="text"
                                   className={(stateForm != 0 ? "disabled " : "") + "form-control"}
                                   placeholder="Ingresa la identificación"
                                   onChange={(e) => saveIdentificationValue(e.target)}/>
                            <small className="form-text only-errors">El número de Identificación ingresado, no corresponde con el tipo de identificación seleccionado.</small>
                        </div>
                    </div>
                </div>

                <div className={(stateForm != 1 ? "hide " : "")}>

                    <div className="row">
                        <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                            <div className={"form-group " + cotizacionErrors.identification_name}>
                                <label htmlFor="doc-type-value">Primer nombre</label>
                                <input name="name" id="doc-type-value" type="text" className="form-control"
                                       placeholder="Ingresa primer nombre"
                                       onChange={(e) => saveIdentificationValue(e.target)}/>
                            </div>
                        </div>
                        <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                            <div className={"form-group " + cotizacionErrors.identification_lastname}>
                                <label htmlFor="doc-type-value">Primer apellido</label>
                                <input name="lastname" id="doc-type-value" type="text" className="form-control"
                                       placeholder="Ingresa primer apellido"
                                       onChange={(e) => saveIdentificationValue(e.target)}/>
                            </div>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                            <div className={"form-group " + cotizacionErrors.identification_city}>
                                <label htmlFor="doc-type-value">Ciudad o municipio del hogar</label>
                                <input name="city" id="doc-type-value" type="text" className="form-control"
                                       placeholder="Ingresa ciudad o municipio del h..."
                                       onChange={(e) => saveIdentificationValue(e.target)}/>
                                <small className="form-text only-errors">Por favor ingrese la Ciudad o Municipio del Hogar.</small>
                            </div>
                        </div>
                        <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                            <div className={"form-group " + cotizacionErrors.identification_address}>
                                <label htmlFor="doc-type-value">Dirección del hogar</label>
                                <input name="address" id="doc-type-value" type="text" className="form-control"
                                       placeholder="Ingresa la dirección"
                                       onChange={(e) => saveIdentificationValue(e.target)}/>
                                <small className="form-text text-muted">Ejemplo: Calle 143Bis # 23 a 34</small>
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
                                onClick={() => nextStepIndex(cotizacion)} type="button">Guardar y salir
                        </button>
                        <button disabled={cotizacion.continueButtonDisable} onClick={() => nextStepIndex(cotizacion)}
                                type="button"
                                className={(cotizacion.continueButtonDisable ? 'disabled ' : '') + "btn btn-primary"}>Continuar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        stateForm: state.stateForm,
        identifications: state.identifications,
        cotizacion: state.cotizacion,
        cotizacionErrors: state.cotizacionErrors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveIdentificationType(value) {
            dispatch(saveIdentificationType(value));
        },
        saveIdentificationValue(value) {
            dispatch(saveIdentificationValue(value));
        },
        nextStepIndex() {
            dispatch(nextStepIndex());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);