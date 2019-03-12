import React, { Component } from 'react';
import './Submenu.scss';

class Submenu extends Component {
    render() {
        return (
            <aside className="cotizaciones-aside">
                <div className="container">
                    <div className="row">
                        <div id="id-cotizacion" className="col col-sm-2 col-md-2 col-lg-2">
                            <p>Cotización <span className="value">234562</span></p>
                        </div>
                        <div id="cotizacion-menu" className="col col-sm-8 col-md-8 col-lg-8">
                            <ul>
                                <li className="active"><span>1</span>Identificación</li>
                                <li><span>2</span>Descripción del inmueble</li>
                                <li><span>3</span>Cotización</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </aside>
        );
    }
}

export default Submenu;
