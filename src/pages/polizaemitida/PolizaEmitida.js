import React, {Component} from 'react';
import './PolizaEmitida.scss';
import SendMail from "../../components/cotizaciones/cotizacion/popups/sendmail/SendMail";
import Loading from "../../components/globals/loading/Loading";
import QuoteIussedById from "../../services/QuoteIussedById";
import PrevPdfPolizaPrima from "../../services/PrevPdfPolizaPrima";
import PolizaAnexoHogar from "../../services/PolizaAnexoHogar";

class PolizaEmitida extends Component {

    constructor(props) {
        super(props);
        this.state = {
            quote: this.props.match.params.id
        };
    }

    componentDidMount() {
        Loading.toggle(false);
    }

    openModal = () => {
        SendMail.toggle(true);
    };

    getPdf = async () => {
        Loading.toggle(true);
        let data = await QuoteIussedById.get(this.state.quote);
        let plan = data.plan_selected_info.Item;
        try {
            let pdfAnexo = await PolizaAnexoHogar.get(plan, this.state.quote);
            let pdf = await PrevPdfPolizaPrima.get(plan, this.state.quote);
            console.log(pdf);
            console.log(pdfAnexo);
        } catch (e) {
            Loading.toggle(true);
        }
    };

    render() {
        return (
            <div className="cotizacion exito">
                <div className="index-form">
                    <div className="container">
                        <div className="row">
                            <div className="col col-sm-12 col-md-12 col-lg-12 title">
                                <h2>¡Póliza emitida!</h2>
                                <h3>En los próximos minutos, se enviará un mail con la información de la poliza e
                                    información de utilidad</h3>
                                <p>Póliza <span>{this.state.quote}</span></p>
                                <div className="image">&nbsp;</div>
                            </div>
                        </div>

                        <div className={"row text-center links-row"}>
                            <div className="col col-sm-12 col-md-12 col-lg-12">
                                <div className="generatepdf link-item" onClick={this.getPdf}>
                                    <p><i>&nbsp;</i> Generar cotización en PDF</p>
                                </div>
                                {/*<div className="sendpdf link-item" onClick={this.openModal}>*/}
                                {/*<p><i>&nbsp;</i> Enviar por correo</p>*/}
                                {/*</div>*/}
                            </div>
                        </div>

                        <div className={"row text-center"}>
                            <div className="col col-sm-12 col-md-12 col-lg-12">
                                <button type="button" className={"btn btn-default"}>Nueva cotización</button>
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
