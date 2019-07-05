import React, {Component, Fragment} from 'react';

import {withRouter} from "react-router-dom";
import {UrlSite} from "../../../../../config";
import Helpers from "../../../../../common/helpers/helpers/Helpers";
//Services
import QuoteIussed from "../../../../../services/QuoteIussed";
import store from "../../../../../store";
import {NextStep} from "../../../../../actions";
import SaveIdentifications from "../../../../../services/Quote";
import Loading from "../../../../globals/loading/Loading";
import Persona from "../../popups/persona/Persona";

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
        this.props.history.push(UrlSite + "/cotizacion/3/" + this.props.match.params.id);
    };

    nextStep = total => async () => {
        Loading.toggle(true);
        let persons = this.props.persons;
        let takers = {};
        let insured = [];
        let benefists = [];
        let onerous = [];
        let additional = [];
        let personsMerge = {};
        for (let i = 0; i < persons.length; i++) {
            let person = persons[i];
            if (typeof personsMerge[person['value']] === "undefined") {
                personsMerge[person['value']] = person;
            } else {
                person['role'] = person['role'].concat(personsMerge[person['value']]['role']);
                personsMerge[person['value']]['role'] = [...new Set(person['role'])].sort(Helpers.orderArrayNumeric);
            }
        }
        let newPersons = [];
        for (let i in personsMerge) newPersons.push(personsMerge[i]);
        persons = newPersons;

        for (let i = 0; i < persons.length; i++) {
            let location = persons[i]['ciudad'];
            let dataUser = {
                person: persons[i].person,
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
                location: location,
                address_type: persons[i]['adresstype'],
                address: persons[i]['address'],
                sarlaft_document_url: persons[i]['sarlaft_document_url'],
                role: persons[i]['role'],
                businessname: persons[i]['businessname'],
                fechadecontitucion: persons[i]['fechadecontitucion'],
                city_code: persons[i]['city_code'],
                department_code: persons[i]['department_code'],
                ciudad: persons[i]['city'],
                departamento: persons[i]['department'],
            };
            if (typeof persons[i].person !== "undefined" && persons[i].person !== "") {
                dataUser = Persona.extractDataFromIaxis(persons[i].person, persons[i]['code'], dataUser);
            }

            if (typeof persons[i]['sarlaft'] !== "undefined") dataUser['sarlaft_document_url'] = persons[i]['sarlaft'];
            if (typeof persons[i]['sarlaft_document_url'] !== "undefined") dataUser['sarlaft_document_url'] = persons[i]['sarlaft_document_url'];
            if (typeof persons[i]['sarlfalt_url'] !== "undefined") dataUser['sarlaft_document_url'] = persons[i]['sarlfalt_url'];
            for (let i in dataUser) if (dataUser[i] === '""') dataUser[i] = ' ';
            for (let i in dataUser) if (dataUser[i] === "") dataUser[i] = ' ';

            for (let j = 0; j < persons[i]['role'].length; j++) {
                if (persons[i]['role'][j] === 1) {
                    dataUser['code_sarlaft'] = 120;
                    takers = dataUser;
                } else if (persons[i]['role'][j] === 2) {
                    dataUser['code_sarlaft'] = 120;
                    insured.push(dataUser);
                } else if (persons[i]['role'][j] === 3) {
                    dataUser['code_sarlaft'] = 120;
                    benefists.push(dataUser);
                } else if (persons[i]['role'][j] === 4) {
                    onerous.push(dataUser);
                } else if (persons[i]['role'][j] >= 5) {
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
        if (typeof total !== "undefined") {
            store.dispatch(NextStep(5));
            await SaveIdentifications.save();
            this.props.history.push(UrlSite + "/emision/2/" + this.props.match.params.id);
        } else {
            Helpers.goToHome(this.props.history);
        }
        Loading.toggle(false);
    };

    render() {
        return (
            <Fragment>
                <div className={"return-button"}>
                    <button type="button" className="btn btn-link"
                            onClick={this.goBack}><i className="back-icon">&nbsp;</i>Volver
                    </button>
                </div>
                <button type="button" className={"btn btn-default"}
                        onClick={this.nextStep(undefined)}>Guardar y salir
                </button>
                <button type="button" className={"btn btn-primary " + (this.props.inactiveBtn ? 'disabled' : '')}
                        disabled={this.props.inactiveBtn}
                        onClick={this.nextStep(true)}>Continuar
                </button>
            </Fragment>
        );
    }
}

export default withRouter(BtnContinue);



