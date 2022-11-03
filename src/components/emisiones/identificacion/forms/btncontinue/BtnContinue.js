import React, { PureComponent, Fragment } from 'react';

import { withRouter } from 'react-router-dom';
import { UrlSite, UrlPerson } from '../../../../../config';
import Helpers from '../../../../../common/helpers/helpers';
//Services
import QuoteIussed from '../../../../../services/QuoteIussed';
import store from '../../../../../store';
import { NextStep } from '../../../../../store/actions';
import SaveIdentifications from '../../../../../services/Quote';
import Loading from '../../../../globals/loading/Loading';
import Persona from '../../popups/persona/person';
import { fieldsNames } from '../../popups/persona/constants';
import Service from '../../../../../services/Api';
import ValidatePersonIdentity from '../../../../../components/ValidatePersonIdentity';

const UrlServicePerson = UrlPerson;
const Baseurl = '/validarIdentidad';
class BtnContinue extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      step: parseInt(this.props.match.params.step),
      continueButtonDisable: true,
      stateFormIdentificacion: 0,
      cotizacionExclude: [],
      errorValidatePerson: false,
      tittle: '',
      message: '',
      buttonRetry: true,
      idPolicy: store.getState().cotizacion.number,
      subtittle: '',
    };
  }
  goBack = async () => {
    store.dispatch(NextStep(3));
    await SaveIdentifications.save();
    this.props.history.push(
      UrlSite + '/cotizacion/3/' + this.props.match.params.id
    );
  };
  validateData = (document_type, document, first_last_name) => {
    let dataToValidate = {
      identification_type: document_type.toString(),
      identification: document,
      last_name: first_last_name,
    };
    return dataToValidate;
  };
  nextStep = (total) => async () => {
    Loading.toggle(true);
    let token = localStorage.getItem('serviceToken');

    let persons = this.props.persons;
    let takers = {};
    let insured = [];
    let benefists = [];
    let onerous = [];
    let additional = [];
    let newPersons = [];
    let validatePersons = [];
    for (let i in persons) {
      let person = persons[i];
      if (typeof person.object !== 'undefined' && person.object !== '') {
        person = Persona.extractDataFromIaxis(
          person.object,
          person['code'],
          person
        );
      }
      newPersons.push(person);
    }
    persons = newPersons;
    const { personalAccidents, exequiasParticipation } = fieldsNames;
    const sarlaftDocument = 'sarlaft_document_url';
    const habeasDataDocument = 'habeas_data_document_url';
    for (let i in persons) {
      let location = persons['ciudad'];
      const person = persons[i];
      let dataUser = {
        person:
          typeof person.person === 'undefined' ? person.object : person.person,
        first_name: person['name'],
        second_name: person['secondname'],
        first_last_name: person['lastname'],
        second_last_name: person['secondlastname'],
        document_type: person['code'],
        document: person['value'],
        gender: person['genero'],
        birthdate: person['fechadenacimiento'],
        phone_type: person['tipodetelefono'],
        phone: person['telefono'],
        email: person['email'],
        location: location,
        address_type: person['adresstype'],
        address: person['address'],
        sarlaftDocumentUrl: person['sarlaft_document_url'],
        habeasDataDocumentUrl: person['habeas_data_document_url'],
        role: person['role'],
        businessname: person['businessname'],
        fechadecontitucion: person['fechadecontitucion'],
        city_code: person['city_code'],
        department_code: person['department_code'],
        ciudad: person['city'],
        departamento: person['departamento'],
        [personalAccidents]: person[personalAccidents],
        [exequiasParticipation]: person[exequiasParticipation],
      };
      // sarlaft file
      if (typeof person['sarlaft'] !== 'undefined')
        dataUser[sarlaftDocument] = person['sarlaft'];
      if (typeof person[sarlaftDocument] !== 'undefined')
        dataUser[sarlaftDocument] = person[sarlaftDocument];
      if (typeof person['sarlfalt_url'] !== 'undefined')
        dataUser[sarlaftDocument] = person['sarlfalt_url'];
      // sarlaft file
      // habeas data file
      if (typeof person['habeas_data'] !== 'undefined')
        dataUser[habeasDataDocument] = person['habeas_data'];
      if (typeof person[habeasDataDocument] !== 'undefined')
        dataUser[habeasDataDocument] = person[habeasDataDocument];
      if (typeof person['habeas_data_url'] !== 'undefined')
        dataUser[habeasDataDocument] = person['habeas_data_url'];
      // habeas data file
      for (let j in dataUser)
        if (dataUser[j] === '""' || dataUser[j] === '') dataUser[j] = ' ';
      if (dataUser.role.indexOf(5) > -1 || dataUser.role.indexOf(6) > -1) {
        additional.push(dataUser);
      }
      for (let j in person['role']) {
        const isHabeasData =
          dataUser[habeasDataDocument] !== undefined ? true : false;
        dataUser[isHabeasData ? 'code_habeas_data' : 'code_sarlaft'] =
          isHabeasData ? 20 : 120;
        if (person['role'][j] === 1) {
          takers = dataUser;
          validatePersons.push(
            this.validateData(
              dataUser.document_type,
              +dataUser.document_type === 37
                ? dataUser.document.substring(0, dataUser.document.length - 1)
                : dataUser.document,
              +dataUser.document_type === 37
                ? dataUser.businessname
                : dataUser.first_last_name
            )
          );
        } else if (persons[i]['role'][j] === 2) {
          insured.push(dataUser);
        } else if (persons[i]['role'][j] === 3) {
          benefists.push(dataUser);
        } else if (persons[i]['role'][j] === 4) {
          onerous.push(dataUser);
        }
      }
    }

    if (typeof total !== 'undefined') {
      try {
        let responseValidateIndentity = await Service.post(
          Baseurl,
          validatePersons,
          UrlServicePerson,
          undefined,
          {
            Authorization: 'Bearer ' + token,
          }
        );

        if (responseValidateIndentity.status === 0) {
          Loading.toggle(false);
          this.setState({ errorValidatePerson: true });
          this.setState({
            tittle: 'Validación de rol No Exitosa',
            message: `Alguno de los roles no se ha podido verificar: Por favor revise los datos ingresados`,
            buttonRetry: false,
            subtittle:
              'Nota: En caso que la información diligenciada esté correcta, consulta en oficina en linea',
          });
          return;
        }
      } catch (err) {
        Loading.toggle(false);
        this.setState({ errorValidatePerson: true });
        this.setState({
          tittle: 'Ups, lo sentimos',
          message: `Tenemos un problema técnico en este momento`,
          buttonRetry: true,
          subtittle:
            'Por favor, intenta nuevamente a través del boton Reintentar, Si el error persiste, por favor retoma la cotizacion en unos minutos desde Mis negocios',
        });
        return;
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
      persons_aditionals: additional,
    });
    if (typeof total !== 'undefined') {
      store.dispatch(NextStep(5));
      await SaveIdentifications.save();
      this.props.history.push(
        UrlSite + '/emision/2/' + this.props.match.params.id
      );
    } else {
      store.dispatch(NextStep(4));
      await SaveIdentifications.save();
      Helpers.goToHome(this.props.history);
    }
    Loading.toggle(false);
  };

  render() {
    const { inactiveBtn } = this.props;
    const {
      subtittle,
      idPolicy,
      errorValidatePerson,
      tittle,
      message,
      buttonRetry,
    } = this.state;
    return (
      <Fragment>
        <div className={'return-button'}>
          <button type="button" className="btn btn-link" onClick={this.goBack}>
            <i className="back-icon">&nbsp;</i>Volver
          </button>
        </div>
        <button
          type="button"
          className={'btn btn-default'}
          onClick={this.nextStep(undefined)}
        >
          Guardar y salir
        </button>
        <button
          type="button"
          className={'btn btn-primary ' + (inactiveBtn ? 'disabled' : '')}
          disabled={inactiveBtn}
          onClick={this.nextStep(true)}
        >
          Continuar
        </button>
        <ValidatePersonIdentity
          subtittle={subtittle}
          idPolicy={idPolicy}
          tittle={tittle}
          message={message}
          button={buttonRetry}
          open={errorValidatePerson}
          onRetry={this.nextStep(true)}
        />
      </Fragment>
    );
  }
}

export default withRouter(BtnContinue);
