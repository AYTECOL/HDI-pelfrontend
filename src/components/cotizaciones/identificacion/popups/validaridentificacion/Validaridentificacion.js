import React, {Component} from 'react';
import './Validaridentificacion.scss';
import icono from '../../../../../common/images/icon.png';
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class Validaridentificacion extends Component {

    static toggle(status){
        if (status === true){
            Helpers.removeClass('.validaridentificacion', 'hide');
        } else {
            Helpers.addClass('.validaridentificacion','hide');
        }
    }

    hide = () => {
        Validaridentificacion.toggle(false);
    };

    render() {
        return (
            <div className={"modal validaridentificacion hide"}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Ups, lo sentimos</h5>
                            <p className="modal-subtitle">La identificación que ingresaste no nos permite continuar con
                                el proceso</p>
                            <button type="button" className="close" aria-label="Close" onClick={this.hide}>&nbsp;</button>
                        </div>
                        <div className="modal-body">
                            <div className="content">
                                <div className="icono">
                                    <img src={icono} alt=""/>
                                </div>
                            </div>
                            <div className="buttons">
                                {typeof this.props.toggle === "undefined"?(
                                    <a href="/" className="btn btn-secondary" data-dismiss="modal">Terminar</a>
                                ):(
                                    <button type="button" className="btn btn-secondary" onClick={this.props.toggle(-2)}>Terminar</button>
                                )}
                                <button type="button" className="btn btn-primary" onClick={typeof this.props.changeValue === "undefined"?this.hide:this.props.changeValue}>Ajustar</button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <p>Para más información comunícate desde Bogotá a la línea <span>307 7050</span> o
                                desde cualquier lugar del país <span>018000 113390</span></p>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

export default Validaridentificacion;