import React, {Component} from 'react';

import './Links.scss';

class Links extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <div className="generatepdf link-item">
                    <p><i></i> Generar cotización en PDF</p>
                </div>
                <div className="sendpdf link-item">
                    <p><i></i> Enviar por correo</p>
                </div>
            </div>
        );
    }
}

export default Links;



