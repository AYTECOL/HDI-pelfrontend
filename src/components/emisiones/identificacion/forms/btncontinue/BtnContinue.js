import React, { PureComponent, Fragment } from "react";

import { withRouter } from "react-router-dom";
import { UrlSite } from "../../../../../config";
import Helpers from "../../../../../common/helpers/helpers/Helpers";
//Services
import QuoteIussed from "../../../../../services/QuoteIussed";
import store from "../../../../../store";
import { NextStep } from "../../../../../actions";
import SaveIdentifications from "../../../../../services/Quote";
import Loading from "../../../../globals/loading/Loading";
import Persona from "../../popups/persona/Persona";
import { fieldsNames } from "../../popups/persona/constants";

class BtnContinue extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      step: parseInt(this.props.match.params.step),
      continueButtonDisable: true,
      stateFormIdentificacion: 0,
      cotizacionExclude: []
    };
  }

  goBack = async () => {
    store.dispatch(NextStep(3));
    await SaveIdentifications.save();
    this.props.history.push(
      UrlSite + "/cotizacion/3/" + this.props.match.params.id
    );
  };

  nextStep = total => async () => {
    Loading.toggle(true);
    let persons = this.props.persons;
    let takers = {};
    let insured = [];
    let benefists = [];
    let onerous = [];
    let additional = [];
    let newPersons = [];
    for (let i = 0; i < persons.length; i++) {
      let person = persons[i];
        if (
          typeof persons[i].object !== 'undefined' &&
          persons[i].object !== ''
        ) {
          person = Persona.extractDataFromIaxis(
            persons[i].object,
            persons[i]['code'],
            person
          );
        }
        newPersons.push(person)
    }
    persons = newPersons;
    const { personalAccidents, exequiasParticipation } = fieldsNames;
    for (let i = 0; i < persons.length; i++) {
      let location = persons[i]["ciudad"];
      let dataUser = {
        person:
          typeof persons[i].person === "undefined"
            ? persons[i].object
            : persons[i].person,
        first_name: persons[i]["name"],
        second_name: persons[i]["secondname"],
        first_last_name: persons[i]["lastname"],
        second_last_name: persons[i]["secondlastname"],
        document_type: persons[i]["code"],
        document: persons[i]["value"],
        gender: persons[i]["genero"],
        birthdate: persons[i]["fechadenacimiento"],
        phone_type: persons[i]["tipodetelefono"],
        phone: persons[i]["telefono"],
        email: persons[i]["email"],
        location: location,
        address_type: persons[i]["adresstype"],
        address: persons[i]["address"],
        sarlaft_document_url: persons[i]["sarlaft_document_url"],
        role: persons[i]["role"],
        businessname: persons[i]["businessname"],
        fechadecontitucion: persons[i]["fechadecontitucion"],
        city_code: persons[i]["city_code"],
        department_code: persons[i]["department_code"],
        ciudad: persons[i]["city"],
        departamento: persons[i]["departamento"],
        [personalAccidents]: persons[i][personalAccidents],
        [exequiasParticipation]: persons[i][exequiasParticipation]
      };
      if (typeof persons[i]["sarlaft"] !== "undefined")
        dataUser["sarlaft_document_url"] = persons[i]["sarlaft"];
      if (typeof persons[i]["sarlaft_document_url"] !== "undefined")
        dataUser["sarlaft_document_url"] = persons[i]["sarlaft_document_url"];
      if (typeof persons[i]["sarlfalt_url"] !== "undefined")
        dataUser["sarlaft_document_url"] = persons[i]["sarlfalt_url"];
      for (let i in dataUser) if (dataUser[i] === '""') dataUser[i] = " ";
      for (let i in dataUser) if (dataUser[i] === "") dataUser[i] = " ";
      if (dataUser.role.indexOf(5) > -1 || dataUser.role.indexOf(6) > -1) {
        additional.push(dataUser);
      }
      for (let j = 0; j < persons[i]["role"].length; j++) {
        if (persons[i]["role"][j] === 1) {
          dataUser["code_sarlaft"] = 120;
          takers = dataUser;
        } else if (persons[i]["role"][j] === 2) {
          dataUser["code_sarlaft"] = 120;
          insured.push(dataUser);
        } else if (persons[i]["role"][j] === 3) {
          dataUser["code_sarlaft"] = 120;
          benefists.push(dataUser);
        } else if (persons[i]["role"][j] === 4) {
          onerous.push(dataUser);
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
      this.props.history.push(
        UrlSite + "/emision/2/" + this.props.match.params.id
      );
    } else {
      Helpers.goToHome(this.props.history);
    }
    Loading.toggle(false);
  };

  render() {
    const { inactiveBtn } = this.props;
    return (
      <Fragment>
        <div className={"return-button"}>
          <button type="button" className="btn btn-link" onClick={this.goBack}>
            <i className="back-icon">&nbsp;</i>Volver
          </button>
        </div>
        <button
          type="button"
          className={"btn btn-default"}
          onClick={this.nextStep(undefined)}
        >
          Guardar y salir
        </button>
        <button
          type="button"
          className={"btn btn-primary " + (inactiveBtn ? "disabled" : "")}
          disabled={inactiveBtn}
          onClick={this.nextStep(true)}
        >
          Continuar
        </button>
      </Fragment>
    );
  }
}

export default withRouter(BtnContinue);
