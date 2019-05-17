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
        let takers = {};
        let insured = [];
        let benefists = [];
        let onerous = [];
        let additional = [];
        for (let i = 0; i < persons.length; i++) {
            let dataUser = {
                first_name: persons[i]['name'],
                second_name: persons[i]['secondname'],
                first_last_name: persons[i]['lastname'],
                second_last_name: persons[i]['secondlastname'],
                document_type: persons[i]['code'],
                document: persons[i]['value'],
                gender: persons[i]['genero'],
                birthdate: persons[i]['fechadenacimiento'],
                phone_type: persons[i]['tipodetelefono'],
                phone: persons[i]['telefono'],
                email: persons[i]['email'],
                location: persons[i]['ciudad'],
                address_type: persons[i]['adresstype'],
                address: persons[i]['address'],
                sarlaft_document_url: persons[i]['sarlfaltActive'],
                role: persons[i]['role'],
            };
            for(let i in dataUser){
                if( dataUser[i] === "" ){
                    dataUser[i] = '""';
                }
            }
            for (let j = 0; j < persons[i]['role'].length; j++) {
                if (persons[i]['role'][j] === 1){
                    takers = dataUser;
                }else if(persons[i]['role'][j] === 2){
                    insured.push(dataUser);
                }else if(persons[i]['role'][j] === 3){
                    benefists.push(dataUser);
                }else if(persons[i]['role'][j] === 4){
                    onerous.push(dataUser);
                }else if(persons[i]['role'][j] >= 5){
                    additional.push(dataUser);
                }
            }
        }
        let quouteId = this.props.match.params.id;
        await QuoteIussed.get({
            id: quouteId,
            risk_valoration: quouteId,
            taker: takers,
            insured: insured,
            benefist: benefists,
            onerous: onerous,
            persons_aditionals: additional
        });
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



