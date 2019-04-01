import React from 'react';
import './Tab1.scss';
import {withRouter} from "react-router-dom";

//Component

class Tab1 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
        };
    }

    render() {
        return (
            <div>

                <div className="first-content">
                    <div className="row">
                        <div className="col col-12 col-md-3 col-lg-3">
                            <p className="textdescript">Ver asistencias</p>
                        </div>
                        <div className="col col-12 col-md-6 col-lg-6">
                            <p className="centerdescription"><span>Financiación</span> $30.000 / 10 cuotas</p>
                        </div>
                        <div className="col col-12 col-md-3 col-lg-3">
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col col-12 col-sm-12 col-md-2 col-lg-2">

                    </div>
                </div>


            </div>
        )
    }

}

export default withRouter(Tab1);