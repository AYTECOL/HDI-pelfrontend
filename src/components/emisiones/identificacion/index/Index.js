import React from 'react';

//Helpers
import Helpers from '../../../../common/helpers/helpers/Helpers';

//Component
import BtnContinue from '../../../globals/forms/emision/identificacion/btncontinue/BtnContinue';
import PopUpDelete from '../popups/delete/Delete';
import PopUpPersona from '../popups/persona/Persona';
import PopUpEntidad from '../popups/entidad/Entidad';

import './Index.scss';
import {withRouter} from "react-router-dom";

class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
            showPopUpDelete: false,
            showPopUpPersona: false,
            showPopUpEntidad: false,
        };

        this.togglePopUpDelete = this.togglePopUpDelete.bind(this);
        this.togglePopUpPersona = this.togglePopUpPersona.bind(this);
        this.togglePopUpEntidad = this.togglePopUpEntidad.bind(this);
    }

    showAnyPopup(name){
        let state = !this.state[name];
        this.setState({
            ...this.state,
            [name]: state
        });
        if( !Helpers.hasClass("body","popup") ){
            Helpers.addClass("body", "popup");
        }else{
            Helpers.removeClass("body", "popup");
        }
    }

    togglePopUpDelete(index){
        this.showAnyPopup("showPopUpDelete")
    }
    togglePopUpPersona(){
        this.showAnyPopup("showPopUpPersona")
    }
    togglePopUpEntidad(){
        this.showAnyPopup("showPopUpEntidad")
    }

    render() {
        return (
            <form autoComplete="off" className="index-form emision">
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 title">
                            <h2>Cuéntanos sobre las personas</h2>
                            <p>Diligencia la siguiente información, agrega a los beneficiarios, asigna roles y no olvides ningún dato, puede ser importante en el futuro.</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col wrapper-more-selected">

                            <div className="row item-select">
                                <div className="col col-1">
                                    <div className="icon-image">&nbsp</div>
                                </div>
                                <div className="col">
                                    <span>Rol</span>
                                    <p className="font-weight-bold">Asegurado, tomador</p>
                                </div>
                                <div className="col">
                                    <span>Identificación</span>
                                    <p>1018465321-6</p>
                                </div>
                                <div className="col">
                                    <span>Razón social</span>
                                    <p>Constructores Viales…</p>
                                </div>
                                <div className="col">
                                    <span>Dirección</span>
                                    <p>Medellin calle 1233…</p>
                                </div>
                                <div className="col actions">
                                    <p>
                                    <i>Modificar</i>
                                    <span className="trash" onClick={(e)=>{
                                        this.togglePopUpDelete(1);
                                    }}>&nbsp;</span>
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="row">
                        <div className="col wrapper-more-items">
                            <div className="more-items" onClick={(e)=>{
                                this.togglePopUpPersona(1);
                            }}>
                                <button className="more-btn">+</button>
                                <p>Agregar persona</p>
                            </div>
                            <div className="more-items" onClick={(e)=>{
                                this.togglePopUpEntidad(1);
                            }}>
                                <button className="more-btn">+</button>
                                <p>Agregar beneficiario oneroso</p>
                            </div>
                        </div>
                    </div>

                    <div className="row no-gutters">
                        <div className="col">
                            <hr/>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col col-md-8 col-lg-8 last-items-emision">
                            <p>Has contratado algunas coberturas (exequias y accidentes personales) que te permiten asegurar a personas adicionales. ¿Deseas hacerlo?</p>
                            <div className="more-items" onClick={(e)=>{
                                this.togglePopUpPersona(1);
                            }}>
                                <button className="more-btn">+</button>
                                <p>Si, agregar persona</p>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div
                            className="col col-12 col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                            <BtnContinue/>
                        </div>
                    </div>
                </div>
                {this.state.showPopUpDelete === true && <PopUpDelete toggle={this.togglePopUpDelete} /> }
                {this.state.showPopUpPersona === true && <PopUpPersona toggle={this.togglePopUpPersona} /> }
                {this.state.showPopUpEntidad === true && <PopUpEntidad toggle={this.togglePopUpEntidad} /> }
            </form>
        )
    }

}

export default withRouter(Index);