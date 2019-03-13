import React, { Component } from 'react';
import { connect } from 'react-redux';
import { validarIdentificacionToogle } from '../../../../../actionCreators';

import './Validaridentificacion.scss';
import icono from './images/icon.png';

const Validaridentificacion = ({ validaridentificacion,  validarIdentificacionToogle }) => {
    return (
        <div className={validaridentificacion.className + " modal validaridentificacion"}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Ups, lo sentimos</h5>
                        <p className="modal-subtitle">La identificación que ingresaste no nos permite continuar con el proceso</p>
                        <button onClick={() => validarIdentificacionToogle('hide')} type="button" className="close" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="content">
                            <div className="icono">
                                <img src={icono} alt=""/>
                            </div>
                        </div>
                        <div className="buttons">
                            <button onClick={() => validarIdentificacionToogle('hide')} type="button" className="btn btn-secondary" data-dismiss="modal">Terminar</button>
                            <button onClick={() => validarIdentificacionToogle('hide')} type="button" className="btn btn-primary">Ajustar</button>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <p>Para más información comunícate desde Bogotá a la línea <span>307 7050</span> o
                            desde cualquier lugar del país <span>018000 113390</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        validaridentificacion: state.validaridentificacion
    };
};

const mapDispatchToProps = dispatch => {
    return {
        validarIdentificacionToogle(className) {
            dispatch(validarIdentificacionToogle(className));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Validaridentificacion);