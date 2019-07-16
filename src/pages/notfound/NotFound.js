import React, {Component} from 'react';
import './NotFound.scss';
import Loading from "../../components/globals/loading/Loading";
import {UrlOficina} from "../../config";

class NotFound extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        document.querySelector("body").className += " notfound";
        document.querySelector("html").className += " notfoundhtml";
        Loading.toggle(false);
    }

    render() {
        return (
            <div className="home">
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 title">
                            <h1>¡Ups!</h1>
                            <h2>No hemos localizado la página que buscas</h2>
                            <a href={UrlOficina}
                               className={"btn btn-primary btn-block"}>Ir a oficina en línea</a>

                            <h3>Error 404</h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NotFound;
