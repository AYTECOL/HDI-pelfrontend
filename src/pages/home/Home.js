import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';

class Home extends Component {
    render() {
        return (
            <div className="home">
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 title">
                            <h2>Mis negocios en línea</h2>
                            <Link className="btn btn-primary btn-home" to='/cotizacion'>Nueva cotización</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
