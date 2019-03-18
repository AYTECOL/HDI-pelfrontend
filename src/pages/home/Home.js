import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './Home.scss';
import AutoIncrementCotizacion from "../../services/AutoIncrementCotizacion";
import store from "../../store";
import {saveCotizacionNumber} from "../../actionCreators";

class Home extends Component {

    constructor(props) {
        super(props);
    }

    async getNumber() {
        let storeState = store.getState();
        let number = await AutoIncrementCotizacion.get();
        number = number.currentValue.toString();
        number = storeState.cotizacion.number.slice(number.length) + number;
        store.dispatch(saveCotizacionNumber(number));
        this.props.history.push('/cotizacion/'+number);
    }

    render() {
        return (
            <div className="home">
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 title">
                            <h2>Mis negocios en línea</h2>
                            <button className="btn btn-primary btn-home" onClick={() => this.getNumber()}>Nueva cotización</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
