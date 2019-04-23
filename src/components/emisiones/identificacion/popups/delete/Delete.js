import React, {Component} from 'react';
import './Delete.scss';
import icono from '../../../../../common/images/trashtrash.png';

export default class Delete extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"modal validaridentificacion show trash-popup"}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Estás seguro de eliminar persona</h5>
                            <p className="modal-subtitle">Una vez elimines la persona, sus datos se borrarán por
                                completo</p>
                            <button type="button" className="close" aria-label="Close" onClick={(e) => {
                                this.props.toggle(0)
                            }}>&nbsp;</button>
                        </div>
                        <div className="modal-body">
                            <div className="content">
                                <div className="icono">
                                    <img src={icono} alt=""/>
                                </div>
                            </div>
                            <div className="buttons">
                                <button type="button" className="btn btn-secondary" onClick={(e) => {
                                    this.props.toggle(0)
                                }}>Cancelar
                                </button>
                                <button type="button" className="btn btn-primary"
                                >Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}