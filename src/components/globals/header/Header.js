import React, { Component } from 'react';
import './Header.scss';
import logo from '../../../common/images/logo.png';

class Header extends Component {
    render() {
        return (
            <header className="App-header">
                <div className="header container">
                    <div className="row">
                        <div id="logo" className="col col-sm-4 col-md-4 col-lg-4">
                            <img src={logo} alt=""/>
                        </div>
                        <div id="main-menu" className="col col-sm-8 col-md-8 col-lg-8">
                            <ul>
                                <li className="active"><a href="#"><i className="icon1"></i>Mis negocios</a></li>
                                <li><a href="#"><i className="icon2"></i>Andres Salamanca</a></li>
                                <li className="logout"><a href="#"><i className="icon3"></i>Salir</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;
