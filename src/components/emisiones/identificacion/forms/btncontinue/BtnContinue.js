import React, {Component, Fragment} from 'react';

import {withRouter} from "react-router-dom";
import {UrlSite} from "../../../../../config";
import Helpers from "../../../../../common/helpers/helpers/Helpers";

//Services
import QuoteIussed from "../../../../../services/QuoteIussed";

class BtnContinue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
            continueButtonDisable: true,
            stateFormIdentificacion: 0,
            cotizacionExclude: [],
        };
    }

    goBack = () => {
        window.location.href = UrlSite + "/cotizacion/3/" + this.props.match.params.id;
    };

    saveAndExit = () => {
        Helpers.goToHome();
    };

    nextStep = async () => {
        let persons = this.props.persons;
        let takers = [];
        for (let i = 0; i < persons.length; i++) {
            if (persons[i]['role'].indexOf(1) !== -1){
                takers.push({
                    first_name: 'name',
                    second_name: 'secondname',
                    first_last_name: 'lastname',
                    second_last_name: 'secondlastname',
                    document_type: 'code',
                    document: 'value',
                    gender: 'genero',
                    birthdate: 'fechadenacimiento',
                    phone_type: '',
                    phone: 'telefono',
                    email: 'email',
                    location: 'ciudad',
                    address_type: '',
                    address: 'address',
                    sarlaft_document_url: 'sarlfaltActive',
                });
            }else if(persons[i]['role'].indexOf(2) !== -1){

            }else if(persons[i]['role'].indexOf(3) !== -1){

            }
        }
        let data = {
            id: 0,
            risk_valoration: 0,
            taker:{
                first_name: '',
                second_name: '',
                first_last_name: '',
                second_last_name: '',
                document_type: '',
                document: '',
                gender: '',
                birthdate: '',
                phone_type: '',
                phone: '',
                email: '',
                location: '',
                address_type: '',
                address: '',
                sarlaft_document_url: '',
            },
            insured:[],
            benefist: [],
            onerous: []
        };
        console.log(persons);
        let save = await QuoteIussed.get(persons);
        return;
        window.location.href = UrlSite + "/emision/2/" + this.props.match.params.id;
    };

    render() {
        return (
            <Fragment>
                <div className={"return-button"}>
                    <a className="btn btn-link" href="#" onClick={this.goBack}><i className="back-icon">&nbsp;</i>Volver</a>
                </div>
                <button type="button" className={"btn btn-default"}
                        onClick={this.saveAndExit}>Guardar y salir
                </button>
                <button type="button" className={"btn btn-primary "+(this.props.inactiveBtn?'disabled':'')}
                        disabled={this.props.inactiveBtn}
                        onClick={this.nextStep}>Continuar
                </button>
            </Fragment>
        );
    }
}

export default withRouter(BtnContinue);



