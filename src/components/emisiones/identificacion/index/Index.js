import React, {Component} from 'react';
//Helpers
import Helpers from '../../../../common/helpers/helpers/Helpers';
//Component
import BtnContinue from '../forms/btncontinue/BtnContinue';
import PopUpDelete from '../popups/delete/Delete';
import PopUpPersona from '../popups/persona/Persona';
import Card from '../card/Card';

import './Index.scss';
import {withRouter} from "react-router-dom";
import store from "../../../../store";
import Validaridentificacion
    from "../../../cotizaciones/identificacion/popups/validaridentificacion/Validaridentificacion";
import QuoteIussedById from "../../../../services/QuoteIussedById";
import Loading from "../../../globals/loading/Loading";

class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
            showPopUpDelete: false,
            showPopUpPersona: false,
            showPopUpEntidad: false,
            cotizacion: {},
            persons: [],
            itemSelected: null,
            inactiveBtn: true,
            typePerson: 1,
            hasAccident: false,
            hasExequias: false
        };
        this.togglePopUpDelete = this.togglePopUpDelete.bind(this);
        this.togglePopUpPersona = this.togglePopUpPersona.bind(this);
        this.updatePerson = this.updatePerson.bind(this);
        store.subscribe(async () => {
            let storeState = store.getState();
            let cotizacion = storeState.cotizacion;
            if (this.state.cotizacion !== cotizacion && this.state.showPopUpPersona === false) {
                let persons = [];
                let tomador = cotizacion.identification;
                tomador['role'] = [1];
                persons.push(tomador);
                this.setState({
                    ...this.state,
                    cotizacion: cotizacion,
                    persons: persons
                });
            }
        });
    }

    componentDidMount() {
        this.getData();
    }

    async getData() {
        Loading.toggle(true);
        let persons = await QuoteIussedById.get(this.props.match.params.id);
        let person = [];
        let hasExequias = false;
        let hasAccident = false;
        if (typeof persons.quote_iussed_info.Item !== "undefined") {
            let items = persons.quote_iussed_info.Item;
            person.push(items.taker);
            for (let i = 0; i < person.length; i++) if (typeof person[i].role === "undefined") person[i].role = [1];

            if (typeof items.benefist !== "undefined") {
                for (let i = 0; i < items.insured.length; i++) person.push(items.insured[i]);
                for (let i = 0; i < person.length; i++) if (typeof person[i].role === "undefined") person[i].role = [2];
            }

            if (typeof items.benefist !== "undefined") {
                for (let i = 0; i < items.benefist.length; i++) person.push(items.benefist[i]);
                for (let i = 0; i < person.length; i++) if (typeof person[i].role === "undefined") person[i].role = [3];
            }

            if (typeof items.onerous !== "undefined") {
                for (let i = 0; i < items.onerous.length; i++) person.push(items.onerous[i]);
                for (let i = 0; i < person.length; i++) if (typeof person[i].role === "undefined") person[i].role = [4];
            }

            if (typeof items.persons_aditionals !== "undefined") {
                for (let i = 0; i < items.persons_aditionals.length; i++) person.push(items.persons_aditionals[i]);
                for (let i = 0; i < person.length; i++) if (typeof person[i].role === "undefined") person[i].role = [5];
            }

            for (let i = 0; i < person.length; i++) {
                person[i]['name'] = person[i]['first_name'];
                person[i]['secondname'] = person[i]['second_name'];
                person[i]['lastname'] = person[i]['first_last_name'];
                person[i]['secondlastname'] = person[i]['second_last_name'];
                person[i]['code'] = person[i]['document_type'];
                person[i]['value'] = person[i]['document'];
                person[i]['genero'] = person[i]['gender'];
                person[i]['fechadenacimiento'] = person[i]['birthdate'];
                person[i]['tipodetelefono'] = person[i]['phone_type'];
                person[i]['telefono'] = person[i]['phone'];
                person[i]['ciudad'] = person[i]['location'];
                person[i]['adresstype'] = person[i]['address_type'];
                person[i]['sarlfalt_url'] = person[i]['sarlaft_document_url'];
            }
        }

        if (typeof persons.plan_selected_info.Item !== "undefined") {
            let coverange = persons.plan_selected_info.Item.coverages;
            for (let i = 0; i < coverange.length; i++) {
                if (coverange[i]['name'].toLowerCase() === 'accidentes personales' && coverange[i]['checked'] === true) hasAccident = true;
                if (coverange[i]['name'].toLowerCase() === 'exequial' && coverange[i]['checked'] === true) hasExequias = true;
            }
        }

        setTimeout(() => {
            this.validateRoles();
        }, 500);

        if (person.length === 0) {
            this.setState({
                ...this.state,
                hasAccident: hasAccident,
                hasExequias: hasExequias
            });
        } else {
            this.setState({
                ...this.state,
                persons: person,
                hasAccident: hasAccident,
                hasExequias: hasExequias
            });
        }
        Loading.toggle(false);
    }

    showAnyPopup(name, index, type) {
        if (typeof type === "undefined") type = 1;
        let state = !this.state[name];
        this.setState({
            ...this.state,
            [name]: state,
            itemSelected: index,
            typePerson: type
        });
        if (!Helpers.hasClass("body", "popup")) {
            Helpers.addClass("body", "popup");
        } else {
            Helpers.removeClass("body", "popup");
        }
    }

    togglePopUpDelete = index => () => {
        this.showAnyPopup("showPopUpDelete", index);
    };

    togglePopUpPersona = (index, type) => e => {
        if (index !== -1 && index !== -2 && typeof type === "undefined") {
            let roles = this.state.persons[index]['role'];
            if (roles.indexOf(5) !== -1 || roles.indexOf(6) !== -1) type = 2;
            if (roles.indexOf(3) !== -1) type = 3;
            if (roles.indexOf(4) !== -1) type = 4;
            if (roles.indexOf(1) !== -1 || roles.indexOf(2) !== -1) type = 1;
        }
        this.showAnyPopup("showPopUpPersona", index, type);
        Validaridentificacion.toggle(false);
    };

    removeItem = () => {
        let persons = this.state.persons;
        let newPerson = [];
        for (let i = 0; i < persons.length; i++) if (i !== this.state.itemSelected) newPerson.push(persons[i]);
        let inactiveBtn = newPerson.length <= 0;
        this.setState({
            ...this.state,
            persons: newPerson,
            inactiveBtn: inactiveBtn
        });
        setTimeout(() => {
            this.showAnyPopup("showPopUpDelete");
        }, 100);
    };

    validateRoles() {
        let persons = this.state.persons;
        let inactiveBtn = this.state.inactiveBtn;
        let status = [];
        for (let i = 0; i < persons.length; i++) {
            for (let j = 0; j < persons[i].role.length; j++) {
                if (persons[i].role[j] === 1 || persons[i].role[j] === 2 || persons[i].role[j] === 3) {
                    status.push(i);
                }
            }
        }
        inactiveBtn = status.length < 3;
        this.setState({
            ...this.state,
            person: persons,
            inactiveBtn: inactiveBtn
        });
    }

    updatePerson(person) {
        console.log(person);
        let persons = this.state.persons;
        if (this.state.itemSelected === -1) {
            persons.push(person);
        } else {
            persons[this.state.itemSelected] = person;
        }

        setTimeout(() => {
            this.validateRoles();
        }, 500);

        this.setState({
            ...this.state,
            person: persons,
        });
        setTimeout(() => {
            this.showAnyPopup("showPopUpPersona");
        }, 100);
    }

    render() {
        return (
            <form autoComplete="off" className="index-form emision">
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 title">
                            <h2>Cuéntanos sobre las personas</h2>
                            <p>Diligencia la siguiente información, agrega a los beneficiarios, asigna roles y no
                                olvides ningún dato, puede ser importante en el futuro.</p>
                        </div>
                    </div>

                    <Card persons={this.state.persons}
                          showEdit={true}
                          togglePopUpPersona={this.togglePopUpPersona}
                          togglePopUpDelete={this.togglePopUpDelete}/>

                    <div className="row">
                        <div className="col wrapper-more-items">
                            <div className="more-items" onClick={this.togglePopUpPersona(-1)}>
                                <button type="button" className="more-btn">+</button>
                                <p>Agregar persona</p>
                            </div>
                            <div className="more-items" onClick={this.togglePopUpPersona(-1, 4)}>
                                <button type="button" className="more-btn">+</button>
                                <p>Agregar beneficiario oneroso</p>
                            </div>
                        </div>
                    </div>

                    <div className="row no-gutters">
                        <div className="col">
                            <hr/>
                        </div>
                    </div>

                    {(this.state.hasExequias === true || this.state.hasAccident === true) &&
                    <div className="row justify-content-center">
                        <div className="col col-md-8 col-lg-8 last-items-emision">
                            <p>Has contratado algunas coberturas (exequias y accidentes personales) que te permiten
                                asegurar a personas adicionales. ¿Deseas hacerlo?</p>
                            <div className="more-items" onClick={this.togglePopUpPersona(-1, 2)}>
                                <button type="button" className="more-btn">+</button>
                                <p>Si, agregar persona</p>
                            </div>
                        </div>
                    </div>
                    }

                    <div className="row">
                        <div
                            className="col col-12 col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                            <BtnContinue persons={this.state.persons} inactiveBtn={this.state.inactiveBtn}/>
                        </div>
                    </div>
                </div>
                {this.state.showPopUpDelete === true &&
                <PopUpDelete toggle={this.togglePopUpDelete} removeItem={this.removeItem}/>}
                {this.state.showPopUpPersona === true && <PopUpPersona
                    toggle={this.togglePopUpPersona}
                    persons={this.state.persons}
                    item={this.state.itemSelected}
                    hasExequias={this.state.hasExequias}
                    hasAccident={this.state.hasAccident}
                    typePerson={this.state.typePerson}
                    updatePerson={this.updatePerson}/>}
                <Validaridentificacion/>
            </form>
        )
    }

}

export default withRouter(Index);
