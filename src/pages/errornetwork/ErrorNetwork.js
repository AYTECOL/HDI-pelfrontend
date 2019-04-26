import React, {Component} from 'react';
import './ErrorNetwork.scss';

import ImageError from '../../common/images/error.png';

class ErrorNetwork extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        document.querySelector("body").className += " errornetwork";
    }

    render() {
        return (
            <div className="error-network">
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 title text-center">
                            <img src={ImageError} alt=""/>
                            <h1>Ups, algo ha ocurrido</h1>
                            <h2>Es posible que exista algún problema con la conexión, intenta de nuevo más tarde.</h2>
                            <a href="/" className={"btn btn-primary"}>Ir a oficina en línea</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ErrorNetwork;
