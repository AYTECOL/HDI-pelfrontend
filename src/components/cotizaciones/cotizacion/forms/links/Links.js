import React, {Component, Fragment} from 'react';
import './Links.scss';
import SendMail from "../../popups/sendmail/SendMail";

class Links extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    openModal = () => {
        SendMail.toggle(true);
    };

    render() {
        return (
            <Fragment>
                <div className="generatepdf link-item">
                    <p><i>&nbsp;</i> Generar cotización en PDF</p>
                </div>
                <div className="sendpdf link-item" onClick={this.openModal}>
                    <p><i>&nbsp;</i> Enviar por correo</p>
                </div>
            </Fragment>
        );
    }
}

export default Links;



