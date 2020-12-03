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
import { isValidDirection } from '../../../../common/validations';
import {
  isRoleParticipation,
  getTotalParticipationPercentage,
  isTotalValid,
  participationValues,
  validateParticipationPercentage,
} from '../popups/persona/ParticipationPercentages/utils';
import { roles } from '../constants';

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
            typePerson: 1,
            hasAccident: false,
            hasExequias: false
        };
        this.togglePopUpDelete = this.togglePopUpDelete.bind(this);
        this.togglePopUpPersona = this.togglePopUpPersona.bind(this);
        this.updatePerson = this.updatePerson.bind(this);
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(async () => {
            let storeState = store.getState();
            let cotizacion = storeState.cotizacion;
            if (this.state.cotizacion !== cotizacion && this.state.showPopUpPersona === false) {
                let persons = [];
                if (this.state.persons.length > 0) {
                    persons = this.state.persons;
                } else {
                    let tomador = { ...cotizacion.identification };
                    if (tomador.name || tomador.businessname) {
                      tomador['role'] = [1];
                      persons.push(tomador);
                    }
                }
                this.setState({
                    ...this.state,
                    cotizacion: cotizacion,
                    persons: persons
                });
            }
        });
        this.getData();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    async getData() {
        Loading.toggle(true);
        let quote = await QuoteIussedById.get(this.props.match.params.id);
        let persons = [];
        let hasExequias = false;
        let hasAccident = false;
        if (typeof quote.plan_selected_info.Item !== "undefined") {
            const { coverages } = quote.plan_selected_info.Item;
            for (let i = 0; i < coverages.length; i++) {
              const coverage = coverages[i];
              const { checked, code_content, code_real_estate } = coverage;
              if (checked === true) {
                const codes = [code_content, code_real_estate];
                if (codes.some((code) => code === 716)) hasAccident = true;
                if (codes.some((code) => code === 774)) hasExequias = true;
              }
            }
        }
        if (typeof quote.quote_iussed_info.Item !== "undefined") {
            let items = quote.quote_iussed_info.Item;

            if (items.taker.length !== 0) {
                persons.push(items.taker);
                for (let i = 0; i < persons.length; i++) if (typeof persons[i].role === "undefined") persons[i].role = [1];
            }

            [
                {name: 'insured', role: 2},
                {name: 'benefist', role: 3},
                {name: 'onerous', role: 4},
                {name: 'persons_aditionals', role: 5},
            ].map((item, key) => {
                if (typeof items[item.name] !== 'undefined') {
                  for (let i = 0; i < items[item.name].length; i++) {
                    const person = items[item.name][i];
                    const rolesPerson = person.role || [];
                    const findIndex = (role) =>
                      rolesPerson.findIndex((r) => r === role);
                    const indexObsequies = findIndex(roles.obsequies);

                    const splice = (index) => rolesPerson.splice(index, 1);

                    if (indexObsequies !== -1 && !hasExequias) {
                      splice(indexObsequies);
                    }

                    const indexPersonalAccidents = findIndex(
                      roles.personalAccidents
                    );

                    if (indexPersonalAccidents !== -1 && !hasAccident) {
                      splice(indexPersonalAccidents);
                    }
                    if (rolesPerson.length) {
                      const newPerson = { ...person, role: rolesPerson };
                      persons.push(newPerson);
                    }
                  }
                  for (let i = 0; i < persons.length; i++)
                    if (typeof persons[i].role === 'undefined')
                      persons[i].role = [item.role];
                }
                return true;
            });

            for (let i = 0; i < persons.length; i++) {
                persons[i]['name'] = persons[i]['first_name'];
                persons[i]['secondname'] = persons[i]['second_name'];
                persons[i]['lastname'] = persons[i]['first_last_name'];
                persons[i]['secondlastname'] = persons[i]['second_last_name'];
                persons[i]['code'] = persons[i]['document_type'];
                persons[i]['value'] = persons[i]['document'];
                persons[i]['genero'] = persons[i]['gender'];
                persons[i]['fechadenacimiento'] = persons[i]['birthdate'];
                persons[i]['tipodetelefono'] = persons[i]['phone_type'];
                persons[i]['telefono'] = persons[i]['phone'];
                persons[i]['ciudad'] = persons[i]['location'];
                persons[i]['adresstype'] = persons[i]['address_type'];
                persons[i]['sarlaft'] = persons[i]['sarlaft_document_url'];
                persons[i]['sarlfalt_url'] = persons[i]['sarlaft_document_url'];
                persons[i]['department'] = persons[i]['departamento'];
                persons[i]['city'] = persons[i]['ciudad'];
            }
        }

        

        if (persons.length === 0) {
            this.setState({
                ...this.state,
                hasAccident: hasAccident,
                hasExequias: hasExequias
            });
        } else {
            this.setState({
                ...this.state,
                persons: persons,
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

    togglePopUpPersona = (index, type) => () => {
        if (index !== -1 && index !== -2 && typeof type === "undefined") {
            const { role } = { ...this.state.persons[index] };
            if (role){
                if (role.indexOf(5) !== -1) type = 5;
                if (role.indexOf(6) !== -1) type = 6;
                if (role.indexOf(3) !== -1) type = 3;
                if (role.indexOf(4) !== -1) type = 4;
                if (role.indexOf(1) !== -1 || role.indexOf(2) !== -1) type = 1;
            }
        }
        this.showAnyPopup("showPopUpPersona", index, type);
        Validaridentificacion.toggle(false);
    };

    removeItem = () => {
        let persons = this.state.persons;
        let newPerson = [];
        for (let i = 0; i < persons.length; i++) if (i !== this.state.itemSelected) newPerson.push(persons[i]);
        this.setState({
            ...this.state,
            persons: newPerson,
        });
        setTimeout(() => {
            this.showAnyPopup("showPopUpDelete");
        }, 100);
    };

    isDisabled(){
        let persons = this.state.persons;
        let status = [];
        let asegurado = false;
        for (const participationValue of participationValues) {
          const haveRole = persons.some((person) =>
            isRoleParticipation(participationValue, person.role)
          );
          if (haveRole) {
            if (!validateParticipationPercentage(persons, participationValue))
              return true;
            const total = getTotalParticipationPercentage(
              persons,
              participationValue
            );
            if (!isTotalValid(total)) {
              return true;
            }
          }
        }
        for (let i = 0; i < persons.length; i++) {
            if (!isValidDirection(persons[i].address)) return true;
            for (let j = 0; j < persons[i].role.length; j++) {
                if (persons[i].role[j] === 1 || persons[i].role[j] === 2 || persons[i].role[j] === 3 || persons[i].role[j] === 4) {
                    if ((typeof persons[i].sarlfalt_url !== "undefined" && persons[i].sarlfalt_url !== "") || persons[i].role[j] === 4 || persons[i].sarlfaltActive) {
                        status.push(i);
                        if( persons[i].role[j] === 2 ){
                            asegurado = true;
                        }
                    }
                }
            }
        }
        return status.length < 3 || asegurado === false;
    }

    /**
     * 
     * @param {import('../popups/persona/ParticipationPercentages').Person} person 
     * @param {*} state 
     */
    exitsPerson(person, state = null) {
        let persons = this.state.persons;
        if (state !== null) persons = state;
        let status = false;
        for (let i = 0; i < persons.length; i++) {
            const currentPerson = persons[i];
            const mergeRoles = [
              ...currentPerson['role'],
              ...person['role'],
            ].some((role) =>
              [roles.obsequies, roles.personalAccidents].some((r) => r === role)
            );
            if (
              parseInt(currentPerson.code) === parseInt(person.code) &&
              parseInt(currentPerson.value) === parseInt(person.value) &&
              !mergeRoles
            ) {
              person['role'] = [...person['role'], ...currentPerson['role']];
              person['role'] = [...new Set(person['role'])].sort(
                Helpers.orderArrayNumeric
              );
              status = {
                person,
                index: i,
              };
            }
        }
        return status;
    }

    updatePerson(person) {
        let persons = this.state.persons;
        let exits = this.exitsPerson(person);
        if (exits !== false) {
            persons[exits.index] = exits.person;
        } else {
            if (this.state.itemSelected === -1) {
                persons.push(person);
            } else {
                persons[this.state.itemSelected] = person;
            }
        }


        this.setState({
            ...this.state,
            person: persons,
        });
        setTimeout(() => {
            this.showAnyPopup("showPopUpPersona");
        }, 100);
    }

    render() {
        const {
            persons,
            hasExequias,
            hasAccident,
            showPopUpDelete,
            showPopUpPersona,
            itemSelected,
            typePerson,
        } = this.state
        return (
          <form autoComplete="off" className="index-form emision">
            <div className="container">
              <div className="row">
                <div className="col col-sm-12 col-md-12 col-lg-12 title">
                  <h2>Cuéntanos sobre las personas</h2>
                  <p>
                    Diligencia la siguiente información, agrega a los
                    beneficiarios, asigna roles y no olvides ningún dato, puede
                    ser importante en el futuro.
                  </p>
                </div>
              </div>

              <Card
                persons={persons}
                showEdit={true}
                togglePopUpPersona={this.togglePopUpPersona}
                togglePopUpDelete={this.togglePopUpDelete}
              />

              <div className="row">
                <div className="col wrapper-more-items">
                  <div
                    className="more-items"
                    onClick={this.togglePopUpPersona(-1)}
                  >
                    <button type="button" className="more-btn">
                      +
                    </button>
                    <p>Agregar persona</p>
                  </div>
                  <div
                    className="more-items"
                    onClick={this.togglePopUpPersona(-1, 4)}
                  >
                    <button type="button" className="more-btn">
                      +
                    </button>
                    <p>Agregar beneficiario oneroso</p>
                  </div>
                </div>
              </div>
              <div className="row no-gutters">
                <div className="col">
                  <hr />
                </div>
              </div>
              {(hasExequias === true || hasAccident === true) && (
                <div className="row justify-content-center">
                  <div className="col col-md-8 col-lg-8 last-items-emision">
                    <p>
                      Has contratado algunas coberturas (exequias y accidentes
                      personales) puedes indicar los beneficiarios en caso de
                      fallecimiento. ¿Deseas hacerlo?
                    </p>
                    <div
                      className="more-items"
                      onClick={this.togglePopUpPersona(-1, 5)}
                    >
                      <button type="button" className="more-btn">
                        +
                      </button>
                      <p>Si, agregar persona</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="row">
                <div className="col col-12 col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                  <BtnContinue
                    persons={persons}
                    inactiveBtn={this.isDisabled()}
                  />
                </div>
              </div>
            </div>
            {showPopUpDelete === true && (
              <PopUpDelete
                toggle={this.togglePopUpDelete}
                removeItem={this.removeItem}
              />
            )}
            {showPopUpPersona === true && (
              <PopUpPersona
                toggle={this.togglePopUpPersona}
                persons={persons}
                item={itemSelected}
                hasExequias={hasExequias}
                hasAccident={hasAccident}
                typePerson={typePerson}
                updatePerson={this.updatePerson}
              />
            )}
            <Validaridentificacion />
          </form>
        );
    }

}

export default withRouter(Index);
