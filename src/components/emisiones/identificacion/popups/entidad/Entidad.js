import React, {Component} from 'react';
import './Entidad.scss';

export default class Entidad extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"modal validaridentificacion show trash-popup"}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Información adicional</h5>
                            <p className="modal-subtitle">Ingresa la información faltante, conocerla es importante para nosotros, no olvides asignar un rol</p>
                            <button type="button" className="close" aria-label="Close" onClick={(e)=>{
                                this.props.toggle(0)
                            }}>&nbsp;</button>
                        </div>
                        <div className="modal-body">
                            <div className="content">

                            </div>
                            <div className="buttons">
                                <button type="button" className="btn btn-primary"
                                >Continuar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}