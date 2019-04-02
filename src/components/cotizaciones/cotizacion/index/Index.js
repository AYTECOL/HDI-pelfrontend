import React from 'react';
import './Index.scss';
import {withRouter} from "react-router-dom";
//Component
import Tab1 from "../tab1/Tab1";

class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
        };
    }

    render() {
        if (this.state.step !== 3) return <div></div>;
        return (
            <form autoComplete="off" className="index-form contizacion-form">
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 title">
                            <h2>Tu cotización</h2>
                            <p>Listo, te sugerimos un paquete recomendado, sin embargo puedes personalizarlo de acuerdo
                                a la necesidad, quita o agrega lo que consideras podría ser de utilidad en el futuro</p>
                        </div>
                    </div>

                    <div className="row tabs text-center">
                        <div className="col col-12 col-sm-12 col-md-4 col-lg-4 no-padding">
                            <div className="item-tab">
                                <span>Básica</span>
                                <p>$ 300.000</p>
                            </div>
                        </div>
                        <div className="col col-12 col-sm-12 col-md-4 col-lg-4 no-padding">
                            <div className="item-tab active">
                                <span>Media</span>
                                <p>$ 700.000</p>
                            </div>
                        </div>
                        <div className="col col-12 col-sm-12 col-md-4 col-lg-4 no-padding">
                            <div className="item-tab">
                                <span>Premium</span>
                                <p>$ 300.000</p>
                            </div>
                        </div>
                    </div>

                    <div className="tabs-header text-center">
                        <Tab1/>
                    </div>

                </div>
            </form>
        )
    }

}

export default withRouter(Index);