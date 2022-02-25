import React, { PureComponent, Fragment } from 'react';

import { withRouter } from 'react-router-dom';
import { UrlSite, UrlPerson } from '../../../../../config';
import Helpers from '../../../../../common/helpers/helpers/Helpers';
//Services
import QuoteIussed from '../../../../../services/QuoteIussed';
import store from '../../../../../store';
import { NextStep } from '../../../../../actions';
import SaveIdentifications from '../../../../../services/Quote';
import Loading from '../../../../globals/loading/Loading';
import Persona from '../../popups/persona/Persona';
import { fieldsNames } from '../../popups/persona/constants';
import Service from '../../../../../services/Api';
import ValidatePersonIdentity from '../../../../../components/ValidatePersonIdentity';

const UrlServicePerson = UrlPerson;
const Baseurl = '/validarIdentidad';
const BaseurlOnerous = '/validarOneroso';
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
    let validateOnerous;
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
      newPersons.push(person);
    }
    persons = newPersons;
    const { personalAccidents, exequiasParticipation } = fieldsNames;

    for (let i = 0; i < persons.length; i++) {
      let location = persons[i]['ciudad'];
      let dataUser = {
        person:
          typeof persons[i].person === 'undefined'
            ? persons[i].object
            : persons[i].person,
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
        departamento: persons[i]['departamento'],
        [personalAccidents]: persons[i][personalAccidents],
        [exequiasParticipation]: persons[i][exequiasParticipation],
      };
      if (typeof persons[i]['sarlaft'] !== 'undefined')
        dataUser['sarlaft_document_url'] = persons[i]['sarlaft'];
      if (typeof persons[i]['sarlaft_document_url'] !== 'undefined')
        dataUser['sarlaft_document_url'] = persons[i]['sarlaft_document_url'];
      if (typeof persons[i]['sarlfalt_url'] !== 'undefined')
        dataUser['sarlaft_document_url'] = persons[i]['sarlfalt_url'];
      for (let j in dataUser)
        if (dataUser[j] === '""' || dataUser[j] === '') dataUser[j] = ' ';
      if (dataUser.role.indexOf(5) > -1 || dataUser.role.indexOf(6) > -1) {
        additional.push(dataUser);
      }
      for (let j = 0; j < persons[i]['role'].length; j++) {
        if (persons[i]['role'][j] === 1) {
          dataUser['code_sarlaft'] = 120;
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
          dataUser['code_sarlaft'] = 120;
          insured.push(dataUser);

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
        } else if (persons[i]['role'][j] === 3) {
          dataUser['code_sarlaft'] = 120;
          benefists.push(dataUser);
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
        } else if (persons[i]['role'][j] === 4) {
          try {
            validateOnerous = { nitConsulta: dataUser.document };
            let responseValidateOnerous = await Service.post(
              BaseurlOnerous,
              validateOnerous,
              UrlServicePerson,
              undefined,
              {
                Authorization: 'Bearer ' + token,
              }
            );
            if (responseValidateOnerous.results[0][1][1].length > 0) {
              dataUser.clausulas =
                responseValidateOnerous.results[0][1][1][0].clausulas;
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
          onerous.push(dataUser);

          validatePersons.push(
            this.validateData(
              dataUser.document_type,
              +dataUser.document_type === 37
                ? dataUser.document.substring(0, dataUser.document.length - 1)
                : dataUser.document,
              dataUser.businessname
            )
          );
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
