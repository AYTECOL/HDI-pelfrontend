import React, {Component} from 'react';
import './PolizaEmitida.scss';
import store from "../../store";
import {toggleTopUpSendMail} from "../../actionCreators";
import SendMail from "../../components/cotizaciones/cotizacion/popups/sendmail/SendMail";

class PolizaEmitida extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    openModal() {
        store.dispatch(toggleTopUpSendMail(true));
    }

    render() {
        return (
            <div className="cotizacion exito">
                <div className="index-form">
                    <div className="container">
                        <div className="row">
                            <div className="col col-sm-12 col-md-12 col-lg-12 title">
                                <h2>¡Póliza emitida!</h2>
                                <h3>En los próximos minutos, se enviará un mail con la información de la poliza e información de utilidad</h3>
                                <p>Póliza <span>234562</span></p>
                                <div className="image"></div>
                            </div>
                        </div>

                        <div className={"row text-center links-row"}>
                            <div className="col col-sm-12 col-md-12 col-lg-12">
                                <div className="generatepdf link-item">
                                    <p><i></i> Generar cotización en PDF</p>
                                </div>
                                <div className="sendpdf link-item" onClick={(e) => {
                                    this.openModal();
                                }}>
                                    <p><i></i> Enviar por correo</p>
                                </div>
                            </div>
                        </div>

                        <div className={"row text-center"}>
                            <div className="col col-sm-12 col-md-12 col-lg-12">
                                <button className={"btn btn-default"}
                                        type="button">Nueva cotización
                                </button>
                                <a href={'/'} type="button"
                                        className={"btn btn-primary"}>Ir a mis negocios
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
                <SendMail/>
            </div>
        );
    }
}

export default PolizaEmitida;
