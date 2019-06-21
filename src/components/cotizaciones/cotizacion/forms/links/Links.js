import React, {Component, Fragment} from 'react';
import './Links.scss';
// import SendMail from "../../popups/sendmail/SendMail";
import PrevPdfPolizaPrima from "../../../../../services/PrevPdfPolizaPrima";
import {withRouter} from "react-router-dom";
import store from "../../../../../store";
import Loading from "../../../../globals/loading/Loading";

class Links extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    /*    openModal = () => {
            SendMail.toggle(true);
        };*/

    getPdf = () => {
        Loading.toggle(true);
        Links.pdf(this);
        Loading.toggle(true);
    };

    static async pdf(it, download = true) {
        let quote = it.props.match.params.id;
        let storeState = store.getState();
        let plans = storeState.AllPlans;
        let index = storeState.indexPlan;
        let plan = plans[index];

        try {
            let pdf = await PrevPdfPolizaPrima.get(plan, quote);
            if (typeof pdf.pdfQuotationFile !== "undefined" && download === true) {
                const a = document.createElement("a");
                a.style.display = "none";
                document.body.appendChild(a);
                a.href = pdf.pdfQuotationFile;
                a.setAttribute("target", "_blank");
                a.setAttribute("download", pdf.pdfQuotationFile);
                a.click();
                document.body.removeChild(a);
            }
        } catch (e) {

        }
    }

    render() {
        return (
            <Fragment>
                <div className="generatepdf link-item" onClick={this.getPdf}>
                    <p><i>&nbsp;</i> Generar cotización en PDF</p>
                </div>
                {/*<div className="sendpdf link-item" onClick={this.openModal}>*/}
                {/*<p><i>&nbsp;</i> Enviar por correo</p>*/}
                {/*</div>*/}
            </Fragment>
        );
    }
}

export default withRouter(Links);



