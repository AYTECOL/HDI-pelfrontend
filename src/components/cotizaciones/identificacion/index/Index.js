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

store.dispatch(loadIdentifications());

const Index = ({ stateForm, identifications, cotizacion, cotizacionErrors, saveIdentificationType, saveIdentificationValue, nextStepIndex }) => {
    return (
        <div className="index-form">
            <div className="container">
                <div className="row">
                    <div className="col col-sm-12 col-md-12 col-lg-12 title">
                        <h2>Comencemos</h2>
                        <p>Ingresa la siguiente información, así sabremos si es viable continuar con el proceso de cotización</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                        <div className={"form-group input-select "+cotizacionErrors.identification_type}>
                            <label htmlFor="doc-type">Tipo de identificación</label>
                            <select name="doc-type" id="doc-type" className="form-control" defaultValue={cotizacion.identification.code} onChange={(e) => saveIdentificationType(e.target.value)}>
                                <option value="">Selecciona</option>
                                <option value="default">Eliminar</option>
                                {identifications.identifications.map(identification =>
                                    <option key={identification.code} value={identification.code}>{identification.description}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                        <div className={"form-group "+cotizacionErrors.identification_value}>
                            <label for="doc-type-value">Número de identificación</label>
                            <input name="doc-type-value" id="doc-type-value" type="text" className="form-control" placeholder="Ingresa la identificación" onChange={(e) => saveIdentificationValue(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className={ (stateForm != 1?"hide ":"") + "row"}>
                    <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                        <div className={"form-group " + cotizacionErrors.identification_value}>
                            <label htmlFor="doc-type-value">Primer nombre</label>
                            <input name="doc-type-value" id="doc-type-value" type="text" className="form-control"
                                   placeholder="Ingresa primer nombre"
                                   onChange={(e) => saveIdentificationValue(e.target.value)}/>
                        </div>
                    </div>
                    <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                        <div className={"form-group " + cotizacionErrors.identification_value}>
                            <label htmlFor="doc-type-value">Primer apellido</label>
                            <input name="doc-type-value" id="doc-type-value" type="text" className="form-control"
                                   placeholder="Ingresa primer apellido"
                                   onChange={(e) => saveIdentificationValue(e.target.value)}/>
                        </div>
                    </div>
                    <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                        <div className={"form-group " + cotizacionErrors.identification_value}>
                            <label htmlFor="doc-type-value">Ciudad o municipio del hogar</label>
                            <input name="doc-type-value" id="doc-type-value" type="text" className="form-control"
                                   placeholder="Ingresa ciudad o municipio del h..."
                                   onChange={(e) => saveIdentificationValue(e.target.value)}/>
                        </div>
                    </div>
                    <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                        <div className={"form-group " + cotizacionErrors.identification_value}>
                            <label htmlFor="doc-type-value">Dirección del hogar</label>
                            <input name="doc-type-value" id="doc-type-value" type="text" className="form-control"
                                   placeholder="Ingresa la dirección"
                                   onChange={(e) => saveIdentificationValue(e.target.value)}/>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                        <button onClick={() => nextStepIndex(cotizacion)} type="button" className="btn btn-primary">Continuar</button>
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