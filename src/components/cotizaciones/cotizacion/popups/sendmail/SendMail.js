import React, {Component} from 'react';
import './SendMail.scss';

class SendMail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showPopUp: false,
            errorValue: 0,
            totalItems: 1
        };

        // store.subscribe(async () => {
        //     let storeState = store.getState();
        //     let showPopUp = storeState.showPopUp;
        //     if (this.state.showPopUp !== showPopUp) {
        //         this.setState({
        //             ...this.state,
        //             showPopUp: showPopUp,
        //         });
        //     }
        // });
    }

    hide() {
    }

    render() {
        return (
            <div className={"modal validaridentificacion " + ((this.state.showPopUp === true) ? 'show' : 'hide')}>
                <div className="modal-dialog sendmail" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Enviar cotización por correo</h5>
                            <p className="modal-subtitle">Ingresa el correo de la persona a la que deseas enviarle la
                                cotización</p>
                            <button type="button" className="close" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="content">
                                {Array(this.state.totalItems).fill(1).map((el, i) =>
                                    <div className={"form-group text-left " + (this.state.errorValue !== 0 ? 'error' : '')}>
                                        <label htmlFor="incendios">Valor</label>
                                        <input placeholder={"Ingresa el correo de la persona"} type="text" className={"form-control"} name="incendios" id="incendios"/>
                                        <small
                                            className={"form-text only-errors " + (this.state.errorValue === 3 ? 'show' : 'hide')}>El
                                            correo no es valido
                                        </small>
                                    </div>
                                )}
                            </div>
                            <div className="buttons">
                                <a href="/" className="btn btn-secondary" data-dismiss="modal">Cancelar
                                </a>
                                <button type="button" className="btn btn-primary"
                                        onClick={(e) => {
                                            this.hide();
                                        }}
                                >Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

export default SendMail;