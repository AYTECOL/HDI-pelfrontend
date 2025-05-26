import React, { Component } from 'react';
import classNames from 'classnames';
import MomentJs from 'moment';
import DatePicker from 'react-datepicker';
import './person.scss';
import Loading from 'components/globals/loading/Loading';
import ConsultaPersonas from 'services/ConsultaPersonas';
import TypeDocuments from 'components/cotizaciones/identificacion/forms/tipodocumento/TipoDocumento';
import Validaridentificacion from 'components/cotizaciones/identificacion/popups/validaridentificacion/Validaridentificacion';
import AutocompleteCities from 'components/cotizaciones/identificacion/forms/autocompletecities/AutocompleteCities';
import { CitiesProvider } from 'components/cotizaciones/identificacion/hooks/cities';
import UploadFiles from './uploadFiles';
import UploadFileService from 'services/UploadFile';
import CheckBoxes from './Checkboxes';
import Helpers from 'common/helpers/helpers';
import NumeroIdentificacion from 'components/cotizaciones/identificacion/forms/numeroidentificacion/NumeroIdentificacion';
import { isValidDirection, validationMessages } from 'common/validations';
import { roles } from '../../constants';
import { TYPES_FILES, fieldsNames } from './constants';
import ParticipationPercentages from './ParticipationPercentages';
import { DateInput } from './DateInput';
import {
  validatePercentageField,
  participationValues,
  rolesParticipations,
  isRoleParticipation,
} from './ParticipationPercentages/utils';
import LegalRepresentative from './legal-representative';
import BeneficiariesFinalPage from './beneficiaries-final';
import { TYPE_DOCUMENT_IS_JURIDIC } from 'assets/constants';

import close_icon from 'assets/images/icon_close.svg';

const maxFileSize = UploadFileService.maxFileSize;

const phoneTypes = {
  mobilePhone: '6',
};

export default class Persona extends Component {
  _isMounted = false;
  validateAllTime = null;

  constructor(props) {
    super(props);
    this.state = {
      showDefaultTextFile: true,
      textFile: null,
      textFileCertificate: null,
      genero: 0,
      exitsTomador: false,
      typePerson: this.props.typePerson,
      nit: false,
      identifications: [],
      personExists: false,
      userRestricted: false,
      ok: 0,
      total: 9,
      errorFile: null,
      errorFileCertificate: null,
      countFiles: 1,
      person: {},
      isLegalRepresentativeBeneficiary:
        this.props?.isLegalRepresentativeBeneficiary || false,
      LegalRepresentative: this.props?.legalRepresentative || null,
      beneficiariesFinal: this.props?.beneficiariesFinal || [],
      fields: [
        'role',
        'code',
        'value',
        'name',
        'name',
        'secondname',
        'lastname',
        'secondlastname',
        'fechadenacimiento',
        'tipodetelefono',
        'telefono',
        'genero',
        'businessname',
        fieldsNames.fechadecontitucion,
        fieldsNames.email,
        'ciudad',
        'sarlfaltActive',
        fieldsNames.adresstype,
        fieldsNames.address,
        fieldsNames.personalAccidents,
        fieldsNames.exequiasParticipation,
      ],
    };
    let person = this.state.person;
    if (
      this.props.item !== -1 &&
      typeof this.props.persons[this.props.item] !== 'undefined'
    )
      person = this.props.persons[this.props.item];
    person.tipodetelefono = phoneTypes.mobilePhone;
    for (const field of this.state.fields) {
      if (typeof person[field] === 'undefined') {
        if (field === 'role') {
          person[field] = [];
        } else if (field === 'sarlfaltActive') {
          person[field] = false;
        } else if (field === 'code') {
          person[field] = this.state.typePerson === 4 ? '37' : '36';
        } else {
          person[field] = '';
        }
        person[field + 'Disabled'] = false;
        person[field + 'Error'] = false;
      } else if (person === null) {
        person[field] = '';
      }
    }

    for (const itemPerson of this.props.persons) {
      if (typeof itemPerson['role'] !== 'undefined') {
        if (itemPerson['role'].indexOf(1) !== -1)
          this.state.exitsTomador = true;
      }
    }
    const { typePerson } = this.state;
    this.state.total = this.getTotal();

    if (typeof this.props.disabledAll !== 'undefined') {
      for (let i in person) {
        person[i + 'Disabled'] = true;
      }
    }

    if (
      typeof person !== 'undefined' &&
      typeof person['city_code'] === 'undefined' &&
      typeof person['department_code'] === 'undefined'
    ) {
      person['city_code'] = 0;
      person['department_code'] = 0;
    }

    if (typePerson !== 4 && typePerson !== 2 && String(person.code) === '37') {
      this.state.nit = true;
    }

    person.sarlfalt_url =
      person?.sarlaft_document_url !== ' '
        ? person?.sarlaft_document_url
        : undefined;
    person.habeas_data_url = person?.habeas_data_document_url || undefined;
    person.cerl_url = person?.cerl_document_url || undefined;
    if (
      typeof person.object !== 'undefined' ||
      typeof person.person !== 'undefined'
    ) {
      this.state.hideLoader = true;
    } else {
      this.state.hideLoader = undefined;
    }
    this.state.person = person;
  }

  getTotal() {
    const { typePerson, exitsTomador } = this.state;
    if (
      (typePerson === 1 && !exitsTomador) ||
      typePerson === 3 ||
      typePerson === 2
    ) {
      return 15;
    } else if (typePerson === 7) {
      return 3;
    } else if (typePerson === 4) {
      return 4;
    } else if (
      typePerson === 5 ||
      typePerson === 6 ||
      (typePerson === 1 && exitsTomador)
    ) {
      /**
       * @type {{ role: number[] }}
       */
      const { role: roles } = this.state.person;
      const totalFields = 6;

      const selectedRoleFields = participationValues.filter((key) => {
        const rolesParticipation = rolesParticipations[key] || [];
        return rolesParticipation.some((roleParticipation) =>
          roles?.some((role) => role === roleParticipation)
        );
      }).length;
      return totalFields + selectedRoleFields;
    }
  }

  /**
   * Merge person data between services iaxis and form data.
   * @param {import('../../../../../services/Person').ResConsultarPersonaRs} resPersona
   * @param code
   * @param person
   * @returns {*}
   */
  static extractDataFromIaxis(resPersona, code, person) {
    const consultarPersonaRs = resPersona['consultarPersonaRs'];
    const persona = consultarPersonaRs && consultarPersonaRs.persona;
    if (parseInt(code) === 37) {
      if (typeof consultarPersonaRs !== 'undefined') {
        if (typeof persona !== 'undefined') {
          if (typeof persona['personaJuridica'] !== 'undefined') {
            if (
              typeof persona['personaJuridica']['razonSocial'] !== 'undefined'
            ) {
              person.businessname = persona['personaJuridica']['razonSocial'];
              person.businessname =
                person.businessname == null ? '' : person.businessname;
              person.businessnameDisabled =
                person.businessname !== '' && person.businessname !== null;
            }
            if (
              typeof persona['personaJuridica']['fechaConstitucion'] !==
              'undefined'
            ) {
              person.fechadecontitucion =
                persona['personaJuridica']['fechaConstitucion'];
              person.fechadecontitucion =
                person.fechadecontitucion !== null
                  ? person.fechadecontitucion.split('T')
                  : '';
              person.fechadecontitucion =
                typeof person.fechadecontitucion[0] !== 'undefined'
                  ? person.fechadecontitucion[0]
                  : '';
              person.fechadecontitucionDisabled =
                person.fechadecontitucion !== '';
            }
            person.valueDisabled = true;
            person.codeDisabled = true;
          }
        }
      }
    } else {
      if (typeof consultarPersonaRs !== 'undefined') {
        if (typeof persona !== 'undefined') {
          if (typeof persona['personaNatural'] !== 'undefined') {
            if (typeof person.genero === 'undefined' || person.genero === '') {
              person.genero = persona['personaNatural']['genero']['codigo'];
              person.genero = person.genero === null ? '' : person.genero;
              person.generoDisabled =
                person.genero !== '' && person.genero !== null;
            }

            if (typeof person.name === 'undefined' || person.name === '') {
              person.name = persona['personaNatural']['primerNombre'];
              person.name = person.name === null ? '' : person.name;
              person.nameDisabled = person.name !== '' && person.name !== null;
            }

            if (
              typeof person.secondname === 'undefined' ||
              person.secondname === ''
            ) {
              person.secondname = persona['personaNatural']['segundoNombre'];
              person.secondname =
                person.secondname === null ? '' : person.secondname;
              person.secondnameDisabled =
                person.secondname !== '' && person.secondname !== null;
            }

            if (
              typeof person.lastname === 'undefined' ||
              person.lastname === ''
            ) {
              person.lastname = persona['personaNatural']['primerApellido'];
              person.lastname = person.lastname === null ? '' : person.lastname;
              person.lastnameDisabled =
                person.lastname !== '' && person.lastname !== null;
            }

            if (
              typeof person.secondlastname === 'undefined' ||
              person.secondlastname === ''
            ) {
              person.secondlastname =
                persona['personaNatural']['segundoApellido'];
              person.secondlastname =
                person.secondlastname === null ? '' : person.secondlastname;
              person.secondlastnameDisabled =
                person.secondlastname !== '' && person.secondlastname !== null;
            }

            person.valueDisabled = true;
            person.codeDisabled = true;

            if (
              typeof person.fechadenacimiento === 'undefined' ||
              person.fechadenacimiento === ''
            ) {
              person.fechadenacimiento =
                persona['personaNatural']['fechaNacimiento'];
              person.fechadenacimiento =
                person.fechadenacimiento !== null
                  ? person.fechadenacimiento.split('T')
                  : '';
              person.fechadenacimiento =
                typeof person.fechadenacimiento[0] !== 'undefined'
                  ? person.fechadenacimiento[0]
                  : '';
              person.fechadenacimientoDisabled =
                person.fechadenacimiento !== '' &&
                person.fechadenacimiento !== null;
            }

            person.personaNatural = persona['personaNatural'];
          }
        }
      }
    }
    if (typeof consultarPersonaRs !== 'undefined') {
      if (typeof persona !== 'undefined') {
        const contactos = persona['contacto'];
        if (typeof contactos !== 'undefined') {
          person.contacto = [];
          person.tipoPersona = persona['tipoPersona'];
          if (!person.email) {
            const listEmail = contactos.filter(
              ({ tipoContacto }) => +tipoContacto.codigo === 3
            );
            const lastEmail = listEmail.reduce(
              (previousValue, currentValue) => {
                if (previousValue) {
                  const validEmail = Helpers.validationEmail(
                    currentValue.textoContacto
                  );
                  if (
                    +currentValue.tipoContacto.codigo === 3 &&
                    validEmail &
                      (currentValue.idContacto > previousValue.idContacto)
                  ) {
                    return currentValue;
                  } else {
                    return previousValue;
                  }
                }
                return null;
              }
              /*  previousValue
                  ? currentValue.tipoContacto.codigo === 3 &&
                    Helpers.validationEmail(currentValue.textoContacto) &&
                    currentValue.idContacto > previousValue.idContacto
                    ? currentValue
                    : previousValue
                  : currentValue,
              null */
            );
            person.email = (lastEmail && lastEmail.textoContacto) || '';
          }
          if (!person.telefono) {
            const codesPhone = [6];
            const lastPhone = contactos.reduce((prevValue, contact) => {
              const tipoContacto = contact.tipoContacto.codigo;
              const isValidCode = codesPhone.find(
                (value) => String(tipoContacto) === String(value)
              );
              if (!prevValue && isValidCode) return contact;
              if (
                isValidCode &&
                contact.idContacto > prevValue.idContacto &&
                Helpers.isNumber(contact.textoContacto)
              )
                return contact;
              return prevValue;
            }, null);
            if (lastPhone) {
              const tipoContacto = lastPhone.tipoContacto.codigo;
              person.telefono = lastPhone.textoContacto;
              person.tipodetelefono = Object.values(phoneTypes).some(
                (type) => String(type) === String(tipoContacto)
              )
                ? tipoContacto
                : phoneTypes.mobilePhone;
            }
          }
          person.contacto = contactos.map((contacto) => {
            const { tipoContacto, textoContacto } = contacto;
            const tipoContactoCode = tipoContacto.codigo;
            return {
              tipoContacto: {
                codigo: tipoContactoCode,
              },
              textoContacto,
            };
          });
        }
        const direcciones = persona.direccion || [];
        const lastDireccion = direcciones.reduce(
          (previousValue, direction) =>
            previousValue
              ? direction.idDireccion > previousValue.idDireccion &&
                direction.textoDireccion
                ? direction
                : previousValue
              : direction,
          null
        );
        person.direccion = direcciones;
        if (lastDireccion) {
          const { departamento, ciudad } = lastDireccion;
          if (!person.ciudad) person.address = lastDireccion['textoDireccion'];
          if (ciudad) {
            if (!person.ciudad) person.ciudad = ciudad['nombre'];
            if (!person.city_code) person.city_code = ciudad['codigo'];
          }
          if (departamento) {
            if (!person.departamento)
              person.departamento = departamento['nombre'];
            if (!person.department_code)
              person.department_code = departamento['codigo'];
          }
          if (lastDireccion['tipoDireccion']) {
            if (!person.adresstype)
              person.adresstype = lastDireccion['tipoDireccion']['codigo'];
          }
        }
      }
    }

    if (
      'informacionSARLAFT' in consultarPersonaRs &&
      'vigente' in consultarPersonaRs['informacionSARLAFT']
    ) {
      person.sarlfaltActive =
        consultarPersonaRs['informacionSARLAFT']?.['vigente'] || false;
      person.sarlfaltActiveDisabled = true;
    }

    if (
      'habeasData' in consultarPersonaRs &&
      'completed' in consultarPersonaRs['habeasData']
    ) {
      person.habeasDataActive =
        consultarPersonaRs['habeasData']?.['completed'] || false;
    }

    return person;
  }

  componentDidMount() {
    this._isMounted = true;
    Helpers.fieldNumeric();
    let personObject = this.state.person;
    if (typeof personObject.person !== 'undefined')
      personObject.object = personObject.person;
    if (typeof personObject.object !== 'undefined' && this.props.item !== -1)
      this.validateDoc({ person: personObject.person }, async () => {
        let person = this.state.person;
        person.codeDisabled = true;
        person.valueDisabled = true;

        this.setState(
          {
            ...this.state,
            person: person,
          },
          () => this.validateAll()
        );
      });
    else this.validateAll();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  /**
   *
   * @param {string} field
   * @param {number} typePerson
   */
  static fieldActive = (field, typePerson) => {
    const { email, fechadecontitucion, adresstype, address } = fieldsNames;
    const { ciudad } = fieldsNames;
    const rolesParticipation = rolesParticipations[field];
    if (rolesParticipation) {
      const roleActived = isRoleParticipation(field, [typePerson]);
      if (!roleActived) return false;
    }

    if (
      typePerson === 4 ||
      typePerson === roles.personalAccidents ||
      typePerson === roles.obsequies
    ) {
      const fields = [fechadecontitucion, email, adresstype, address];
      if (typePerson !== 4) fields.push(ciudad);
      const disabled = fields.some((fieldName) => fieldName === field);
      if (disabled) {
        return false;
      }
    }
    return true;
  };

  isActived = (field) => {
    const { typePerson, person } = this.state;
    /**
     * @type {number[]}
     */
    if (typePerson === roles.onerousBeneficiary && field === fieldsNames.ciudad)
      return true;
    const rolesPerson = person.role;
    return rolesPerson.some((role) => Persona.fieldActive(field, role));
  };

  onChangeFile = (e, typeFile) => {
    let fileName = null;
    let status = true;
    let errorFile = null;
    let person = this.state.person;

    /**
     * @type {File}
     */
    const file = e.target.files[0] || person?.habeas_data;
    let validFile = Helpers.validateFile(file);
    if (!file) {
      errorFile = 'Este campo es requerido';
    } else if (!validFile) {
      errorFile = 'Formato no permitido';
    } else if (file.size >= maxFileSize) {
      errorFile = UploadFileService.messageLimit;
    } else {
      let keyFile = null;
      if (TYPES_FILES.SARLAFT === typeFile) {
        keyFile = TYPES_FILES.SARLAFT;
        person.sarlaft = file;
      } else if (TYPES_FILES.HABEAS_DATA === typeFile) {
        keyFile = TYPES_FILES.HABEAS_DATA;
        person.habeas_data = file;
      } else if (TYPES_FILES.CERL === typeFile) {
        keyFile = TYPES_FILES.CERL;
        person.cerl = file;
      }
      const { abbreviation } = this.state.identifications.find(
        (type) => type.code === +person.code
      );
      fileName = `${keyFile}-${abbreviation}-${person.value}-${
        this.state.countFiles
      }.${file.name.split('.').pop()}`;
      status = false;
    }

    if (typeFile === TYPES_FILES.CERL) {
      this.setState(
        {
          ...this.state,
          textFileCertificate: fileName,
          errorFileCertificate: errorFile,
          showDefaultTextFile: status,
          person: person,
          countFiles: this.state.countFiles + 1,
        },
        () => {
          this.validateAll(null, false, false, typeFile);
        }
      );
    } else {
      this.setState(
        {
          ...this.state,
          textFile: fileName,
          errorFile,
          showDefaultTextFile: status,
          person: person,
          countFiles: this.state.countFiles + 1,
        },
        () => {
          this.validateAll(null, false, false, typeFile);
        }
      );
    }
  };

  generoChange = (index) => () => {
    if (this.state.person.generoDisabled !== true) {
      this.changeValue({
        target: {
          name: 'genero',
          value: index,
        },
      });
    }
  };

  changeDates = (e) => {
    this.changeValue({
      target: {
        name:
          this.state.typePerson === 4
            ? fieldsNames.fechadecontitucion
            : 'fechadenacimiento',
        value: MomentJs(e).format('YYYY-MM-DD'),
      },
    });
  };

  changeValue = (e) => {
    let v = e.target.value;
    let n = e.target.name;
    if (n === 'email') {
      v = v.toLowerCase();
      const error = Helpers.validationEmailErros(v);
      if (error) {
        sessionStorage.setItem('errorEmail', error);
      }
    }
    let nit = this.state.nit;
    let newPerson = this.state.person;
    newPerson[n] = v;
    if (n === 'code') nit = parseInt(v) === 37;
    this.setState(
      {
        ...this.state,
        person: newPerson,
        nit: nit,
      },
      () => {
        this.validateAll(n);
      }
    );
  };

  validateDoc = async (e, callback) => {
    if (this.state.person.value === '') return;
    if (this.state.typePerson === 5 || this.state.typePerson === 6) return;
    let code = this.state.person.code;
    try {
      if (
        typeof e.target !== 'undefined' &&
        e.target.parentNode.className.indexOf('error') !== -1
      ) {
        return;
      }
      Loading.toggle(true);
      let responsePerson = null;
      responsePerson = await ConsultaPersonas.get(
        this.state.person.code,
        this.state.person.value
      );
      if(!responsePerson) responsePerson = e.person;
      if (
        responsePerson !== null &&
        responsePerson.consultarPersonaRs.personaRestringida === true
      ) {
        this.setState(
          {
            ...this.state,
            userRestricted: true,
          },
          () => {
            callback && callback();
            Loading.toggle(false);
            Validaridentificacion.toggle(true);
          }
        );
      } else {
        let person = this.state.person;
        person = Persona.extractDataFromIaxis(responsePerson, code, person);
        person.person = responsePerson;
        this.setState(
          {
            ...this.state,
            person: person,
            userRestricted: false,
            personExists:
              responsePerson.consultarPersonaRs.personaEncontradaIAXIS,
          },
          () => {
            Loading.toggle(false);
            callback && callback();
          }
        );
      }
    } catch (e) {
      if (this.state.personExists) {
        let updatePerson = this.state.person;
        for (let i in updatePerson) {
          if (i.indexOf('Disabled') !== -1 || i.indexOf('Error') !== -1) {
            updatePerson[i] = false;
          } else {
            if (i !== 'value' && i !== 'code' && i !== 'role')
              updatePerson[i] = '';
          }
        }
        this.setState(
          {
            ...this.state,
            person: updatePerson,
            userRestricted: false,
          },
          () => {
            Loading.toggle(false);
            callback && callback();
          }
        );
      }
      Loading.toggle(false);
    }
  };

  changeValuePopup = () => {
    let newPerson = this.state.person;
    newPerson.value = '';
    this.setState({
      ...this.state,
      person: newPerson,
    });
  };

  saveFile = async ({ person }) => {
    if (!(person.sarlfalt_url || person.habeas_data_url) || !person.cerl_url) {
      Loading.toggle(true);
      const files = [];
      if (person?.sarlaft && !person?.sarlfalt_url) {
        files.push({
          name: this.state.textFile,
          type: TYPES_FILES.SARLAFT,
          fileValue: person.sarlaft,
        });
      } else if (person?.habeas_data && !person?.habeas_data_url) {
        files.push({
          name: this.state.textFile,
          type: TYPES_FILES.HABEAS_DATA,
          fileValue: person.habeas_data,
        });
      }
      if (person?.cerl && !person?.cerl_url) {
        files.push({
          name: this.state.textFileCertificate,
          type: TYPES_FILES.CERL,
          fileValue: person.cerl,
        });
      }
      for (const fileValues of files) {
        const file = await UploadFileService.upload(
          fileValues.type,
          fileValues.fileValue,
          fileValues.name || null
        ).catch((e) => {
          console.error(e);
        });
        if (file && typeof file['location'] !== 'undefined') {
          if (TYPES_FILES.SARLAFT === fileValues.type) {
            person.sarlaft = file['location'];
            person.sarlfalt_url = file['location'];
            person.sarlaft_document_url = file['location'];
          } else if (TYPES_FILES.HABEAS_DATA === fileValues.type) {
            person.habeas_data = file['location'];
            person.habeas_data_url = file['location'];
            person.habeas_data_document_url = file['location'];
          } else {
            person.cerl = file['location'];
            person.cerl_url = file['location'];
            person.cerl_document_url = file['location'];
          }
        }
      }
      Loading.toggle(false);
      return person;
    }
    return person;
  };

  getErrors() {
    const errors = [];
    const {
      typePerson,
      nit,
      person,
      errorFile,
      LegalRepresentative,
      beneficiariesFinal,
      isLegalRepresentativeBeneficiary,
      personExists,
    } = this.state;
    const {
      value: documentfield,
      code,
      sarlfaltActive,
      email,
      sarlaft,
      genero,
      fechadenacimiento,
      fechadecontitucion,
      role,
      lastname,
      name,
      habeasDataActive,
      cerl,
      habeas_data,
      businessname,
      ciudad,
      adresstype,
    } = person;

    const isPersonNatural = +code !== 37;
    const isJuridicPerson = +code === 37;

    const isTaker = role.some((rol) => +rol === 1);
    const address = String(person.address);
    const tipodetelefono = String(person.tipodetelefono);
    const telefono = String(person.telefono);
    const empty = (value) => !String(value || '').trim();

    let documentfieldInvalid = NumeroIdentificacion.validate(
      documentfield,
      code
    );
    if (documentfieldInvalid === true) {
      errors.push(fieldsNames.documentfield);
    }
    if (empty(code)) errors.push('code');
    const rolesWithPhone = [roles.taker, roles.insured, roles.beneficiary];
    if (rolesWithPhone.find((role) => String(role) === String(typePerson))) {
      let telefonoHasError = false;
      if (tipodetelefono === phoneTypes.mobilePhone) {
        if (Helpers.isMobilePhone(telefono)) {
          telefonoHasError = true;
        }
      } else errors.push('tipodetelefono');
      if (empty(telefono) || telefonoHasError) errors.push('telefono');
    }

    if (
      this.isActived(fieldsNames.email) &&
      Helpers.validationEmail(email) === false
    )
      errors.push(fieldsNames.email);
    if (
      this.isActived(fieldsNames.email) &&
      Helpers.validationEmailErros(email) !== ' '
    ) {
      const error = Helpers.validationEmailErros(email);
      sessionStorage.setItem('errorEmail', error);
    }

    // validations for sarlaft file person natural
    if (
      (!this.props.exceptionSarlaft &&
        isPersonNatural &&
        isTaker &&
        !sarlfaltActive &&
        !habeas_data &&
        !sarlaft) ||
      errorFile
    ) {
      errors.push(TYPES_FILES.SARLAFT);
    }
    // validations for sarlaft file person legal
    if (
      (!this.props.exceptionSarlaft &&
        !isPersonNatural &&
        isTaker &&
        !sarlfaltActive &&
        !sarlaft) ||
      errorFile
    ) {
      errors.push(TYPES_FILES.SARLAFT);
    }

    //Validation for habeas data file
    if (
      (isPersonNatural &&
        !habeasDataActive &&
        !sarlfaltActive &&
        !sarlaft &&
        !habeas_data) ||
      errorFile
    ) {
      errors.push(TYPES_FILES.HABEAS_DATA);
    }

    if (
      (isTaker &&
        !cerl &&
        !this.state.personExists &&
        !this.state.exitsTomador) ||
      (errorFile && !this.state.exitsTomador)
    ) {
      errors.push(TYPES_FILES.CERL);
    }

    if (typePerson === 4 || nit) {
      if (empty(businessname)) errors.push('businessname');
    } else {
      if (empty(lastname)) errors.push('lastname');
      if (empty(name)) errors.push('name');
    }

    if (this.isActived(fieldsNames.ciudad) && !ciudad) errors.push('ciudad');
    if (this.isActived(fieldsNames.adresstype) && !adresstype)
      errors.push('adresstype');

    if (typePerson === 1 && nit === false) {
      if (empty(genero)) {
        errors.push('genero');
      }
    }
    if (typePerson !== 4 && nit === false) {
      if (empty(fechadenacimiento)) {
        errors.push('fechadenacimiento');
      }
    }
    if (typePerson === 4) {
      if (
        !fechadecontitucion &&
        this.isActived(fieldsNames.fechadecontitucion)
      ) {
        errors.push(fieldsNames.fechadecontitucion);
      }
    }
    if (typePerson !== 4 && typePerson !== 7) {
      if (role.length === 0) errors.push('role');
    }

    let indexSecondName = errors.indexOf('secondname');
    if (indexSecondName !== -1) errors.splice(indexSecondName, 1);

    if (
      this.isActived(fieldsNames.address) &&
      (empty(address) || !isValidDirection(address) || address.length < 5)
    )
      errors.push(fieldsNames.address);

    participationValues.forEach((participationValue) => {
      if (this.isActived(participationValue)) {
        if (!validatePercentageField(person[participationValue]))
          errors.push(participationValue);
      }
    });
    // valid infomation, if legal representative is required and beneficiales final is required
    if (isTaker && isJuridicPerson && !personExists) {
      if (!LegalRepresentative) errors.push('LegalRepresentative');
      if (
        !isLegalRepresentativeBeneficiary &&
        beneficiariesFinal.length === 0
      ) {
        errors.push('beneficiariesFinal');
      }
    }
    return errors;
  }

  async validateAll(
    name = null,
    printErrors = false,
    saveData = false,
    typeFile = null
  ) {
    try {
      if (typeof this.props.updatePerson !== 'undefined') {
        if (typeof printErrors === 'undefined') printErrors = false;
        let msj4 = true;
        const { typePerson } = this.state;
        const total = this.getTotal();

        const errors = this.getErrors();

        const valid = !errors.length;
        if (valid) msj4 = false;
        if (valid && saveData) {
          const state = this.state;
          let { person } = state;
          let newPerson = await this.saveFile({ person });
          if (typeof newPerson.code === 'undefined')
            newPerson.code = typePerson !== 4 ? '36' : '37';
          if (state.typePerson === 4) newPerson.role.push(4);
          this.props.updatePerson(newPerson);
          if (this.state.beneficiariesFinal.length > 0) {
            const data = this.state.beneficiariesFinal;
            this.props.updateBeneficiaries(data);
          }
          if (this.state.isLegalRepresentativeBeneficiary) {
            const data = this.state.beneficiariesFinal;
            data.push(this.state.LegalRepresentative);
            this.props.updateBeneficiaries(data);
          }
          if (this.state.LegalRepresentative) {
            this.props.updateLegalRepresentative(
              this.state.LegalRepresentative
            );
          }
          if (this.state.isLegalRepresentativeBeneficiary) {
            this.props.updateIsLegalRepresentativeBeneficiary(
              this.state.isLegalRepresentativeBeneficiary
            );
          }
        } else {
          this.setState({
            ...this.state,
            ok: total - errors.length,
            msj4: msj4,
            total: total,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  validateChange = (event) => {
    if (!isValidDirection(event.key)) {
      event.preventDefault();
      return false;
    }
  };
  handleNewBeneficiaryFinal = (e) => {
    const { beneficiariesFinal } = this.state;
    beneficiariesFinal.push({});
    this.setState({
      ...this.state,
      beneficiariesFinal,
    });
  };
  handleDeleteBeneficiaryFinal = (index) => {
    const { beneficiariesFinal } = this.state;
    beneficiariesFinal.splice(index, 1);
    this.setState({
      ...this.state,
      beneficiariesFinal,
    });
  };

  hasErrorAddClass = (field) => {
    const errors = this.getErrors();
    return errors.find((error) => field === error) && 'error ';
  };

  render() {
    const { persons, item, exceptionSarlaft } = this.props;
    const { typePerson, person } = this.state;
    const errors = this.getErrors();

    const participationPercentages =
      this.isActived(fieldsNames.personalAccidents) ||
      this.isActived(fieldsNames.exequiasParticipation);
    const isTaker = person?.role.some((rol) => +rol === 1);
    let isRequiredFileHabeasData = true;
    if (isTaker && !exceptionSarlaft) isRequiredFileHabeasData = false;

    const isShowUploadFile = isRequiredFileHabeasData
      ? +person?.code !== 37 &&
        !person?.sarlfaltActive &&
        !person?.habeasDataActive
      : !person?.sarlfaltActive;
    const isShowUploadFilecerticate =
      +person?.code === 37 && !this.state.personExists && isTaker;
    const isShowLegalRepresentativeAndBeneficiaries =
      isTaker &&
      +this.state.person.code === TYPE_DOCUMENT_IS_JURIDIC &&
      !this.state.personExists;
    return (
      <React.Fragment>
        <CitiesProvider>
          <div className={'modal validaridentificacion show person-popup'}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div
                  className={'modal-header ' + (typePerson <= 4 ? '' : 'hide')}
                >
                  <h5 className="modal-title">Información adicional</h5>
                  <p className="modal-subtitle">
                    Ingresa la información faltante, conocerla es importante
                    para nosotros, no olvides asignar un rol
                  </p>
                  <button
                    type="button"
                    className="close"
                    aria-label="Close"
                    onClick={this.props.toggle(0)}
                  >
                    <img src={close_icon} alt="" />
                  </button>
                </div>
                <div
                  className={
                    'modal-header ' +
                    (typePerson === 5 || typePerson === 6 ? '' : 'hide')
                  }
                >
                  <h5 className="modal-title">
                    Beneficiario en caso de fallecimiento
                  </h5>
                  <p className="modal-subtitle">
                    Ingresa la información del beneficiario, selecciona los
                    amparos que deseas para el
                  </p>
                  <button
                    type="button"
                    className="close"
                    aria-label="Close"
                    onClick={this.props.toggle(0)}
                  >
                    <img src={close_icon} alt="" />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="content">
                    <CheckBoxes
                      person={this.state.person}
                      changeValue={this.changeValue}
                      typePerson={this.props.typePerson}
                      disabledAll={this.props.disabledAll}
                      exitsTomador={this.state.exitsTomador}
                      hasAccident={this.props.hasAccident}
                      hasExequias={this.props.hasExequias}
                    />

                    {typePerson !== 7 && (
                      <div className="row fields-row">
                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                          <TypeDocuments
                            disabled={
                              this.state.person.codeDisabled || typePerson === 4
                            }
                            sendIdentifications={(identifications) =>
                              this.setState({ ...this.state, identifications })
                            }
                            hideLoader={this.state.hideLoader}
                            value={this.state.person.code}
                            onChange={this.changeValue}
                          />
                        </div>

                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                          <div
                            className={classNames(
                              'value form-group ',
                              this.hasErrorAddClass('documentfield')
                            )}
                          >
                            <label htmlFor="value">Identificación</label>
                            <input
                              type="text"
                              id="documentfield"
                              className={
                                `form-control ${
                                  !this.state.person.value ? 'not-value' : ''
                                }` +
                                (this.state.person.valueDisabled
                                  ? 'disabled'
                                  : '')
                              }
                              disabled={this.state.person.valueDisabled}
                              name="value"
                              value={this.state.person.value}
                              onBlur={(e) => {
                                this.validateDoc(e, () => this.validateAll());
                              }}
                              onChange={this.changeValue}
                            />
                            <small className="form-text only-errors">
                              Falta información requerida para el Tomador. Por
                              favor revise el campo Identificación
                            </small>
                          </div>
                        </div>
                      </div>
                    )}

                    {typePerson === 7 && (
                      <div className={'row fields-row'}>
                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                          <div
                            className={classNames(
                              'name form-group ',
                              this.hasErrorAddClass('name')
                            )}
                          >
                            <label htmlFor="name">
                              Nombre y Apellidos del Contacto
                            </label>
                            <input
                              type="text"
                              className={
                                `form-control ${
                                  !this.state.person.name ? 'not-value' : ''
                                }` +
                                (this.state.person.nameDisabled
                                  ? 'disabled'
                                  : '')
                              }
                              disabled={this.state.person.nameDisabled}
                              name="name"
                              value={this.state.person.name}
                              onChange={this.changeValue}
                            />
                            <small className="form-text only-errors">
                              Falta información requerida para el Tomador. Por
                              favor revise el campo Primer nombre
                            </small>
                          </div>
                        </div>
                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                          <div
                            className={classNames(
                              'name form-group ',
                              this.hasErrorAddClass('telefono')
                            )}
                          >
                            <label htmlFor="telefono">
                              Número de teléfono del Contacto
                            </label>
                            <input
                              type="text"
                              className={
                                'form-control ' +
                                (this.state.person.telefonoDisabled
                                  ? 'disabled'
                                  : '')
                              }
                              disabled={this.state.person.telefonoDisabled}
                              name="telefono"
                              value={this.state.person.telefono}
                              onChange={this.changeValue}
                            />
                            <small className="form-text only-errors">
                              Falta información requerida para el Tomador. Por
                              favor revise el campo Primer nombre
                            </small>
                          </div>
                        </div>
                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                          <div
                            className={classNames(
                              'email form-group ',
                              this.hasErrorAddClass(fieldsNames.email)
                            )}
                          >
                            <label htmlFor={fieldsNames.email}>
                              Correo electrónico del Contacto
                            </label>
                            <input
                              type="text"
                              className={
                                'form-control ' +
                                (this.state.person.emailDisabled
                                  ? 'disabled'
                                  : '')
                              }
                              disabled={this.state.person.emailDisabled}
                              name={fieldsNames.email}
                              value={this.state.person.email}
                              onChange={this.changeValue}
                            />
                            <small className="form-text only-errors">
                              Falta información requerida para el Tomador. Por
                              favor revise el campo Primer nombre
                            </small>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className={'row fields-row'}>
                      {this.state.nit === true ? (
                        <React.Fragment>
                          <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                            <div
                              className={classNames(
                                'name form-group ',
                                this.hasErrorAddClass('businessname')
                              )}
                            >
                              <label htmlFor="name">Razón social</label>
                              <input
                                type="text"
                                className={
                                  'form-control ' +
                                  (this.state.person.businessnameDisabled
                                    ? 'disabled'
                                    : '')
                                }
                                disabled={
                                  this.state.person.businessnameDisabled
                                }
                                name="businessname"
                                value={this.state.person.businessname}
                                onChange={this.changeValue}
                              />
                              <small className="form-text only-errors">
                                Falta información requerida para el Tomador. Por
                                favor revise el campo Razón social
                              </small>
                            </div>
                          </div>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          {typePerson !== 4 && (
                            <React.Fragment>
                              <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                <div
                                  className={classNames(
                                    'name form-group ',
                                    this.hasErrorAddClass('name')
                                  )}
                                >
                                  <label htmlFor="name">Primer nombre</label>
                                  <input
                                    type="text"
                                    className={
                                      `form-control ${
                                        !this.state.person.name
                                          ? 'not-value'
                                          : ''
                                      }` +
                                      (this.state.person.nameDisabled
                                        ? 'disabled'
                                        : '')
                                    }
                                    disabled={this.state.person.nameDisabled}
                                    name="name"
                                    value={this.state.person.name}
                                    onChange={this.changeValue}
                                  />
                                  <small className="form-text only-errors">
                                    Falta información requerida para el Tomador.
                                    Por favor revise el campo Primer nombre
                                  </small>
                                </div>
                              </div>
                              <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                <div
                                  className={classNames(
                                    'pisonumero form-group ',
                                    this.hasErrorAddClass('secondname')
                                  )}
                                >
                                  <label htmlFor="pisonumero">
                                    Segundo nombre
                                  </label>
                                  <input
                                    type="text"
                                    className={
                                      `form-control ${
                                        !this.state.person.secondname
                                          ? 'not-value'
                                          : ''
                                      }` +
                                      (this.state.person.secondnameDisabled
                                        ? 'disabled'
                                        : '')
                                    }
                                    disabled={
                                      this.state.person.secondnameDisabled
                                    }
                                    name="secondname"
                                    value={this.state.person.secondname}
                                    onChange={this.changeValue}
                                  />
                                  <small className="form-text only-errors">
                                    Falta información requerida para el Tomador.
                                    Por favor revise el campo Segundo nombre
                                  </small>
                                </div>
                              </div>

                              <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                <div
                                  className={classNames(
                                    'pisonumero form-group ',
                                    this.hasErrorAddClass('lastname')
                                  )}
                                >
                                  <label htmlFor="pisonumero">
                                    Primer apellido
                                  </label>
                                  <input
                                    type="text"
                                    className={
                                      `form-control ${
                                        !this.state.person.lastname
                                          ? 'not-value'
                                          : ''
                                      }` +
                                      (this.state.person.lastnameDisabled
                                        ? 'disabled'
                                        : '')
                                    }
                                    disabled={
                                      this.state.person.lastnameDisabled
                                    }
                                    name="lastname"
                                    value={this.state.person.lastname}
                                    onChange={this.changeValue}
                                  />
                                  <small className="form-text only-errors">
                                    Falta información requerida para el Tomador.
                                    Por favor revise el campo Primer apellido
                                  </small>
                                </div>
                              </div>
                              <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                <div
                                  className={classNames(
                                    'pisonumero form-group ',
                                    this.hasErrorAddClass('secondlastname')
                                  )}
                                >
                                  <label htmlFor="pisonumero">
                                    Segundo apellido
                                  </label>
                                  <input
                                    type="text"
                                    className={
                                      `form-control ${
                                        !this.state.person.secondlastname
                                          ? 'not-value'
                                          : ''
                                      }` +
                                      (this.state.person.secondlastnameDisabled
                                        ? 'disabled'
                                        : '')
                                    }
                                    disabled={
                                      this.state.person.secondlastnameDisabled
                                    }
                                    name="secondlastname"
                                    value={this.state.person.secondlastname}
                                    onChange={this.changeValue}
                                  />
                                  <small className="form-text only-errors">
                                    Falta información requerida para el Tomador.
                                    Por favor revise el campo Segundo apellido
                                  </small>
                                </div>
                              </div>
                            </React.Fragment>
                          )}
                        </React.Fragment>
                      )}

                      {typePerson !== 4 && (
                        <div
                          className={
                            'col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right ' +
                            (this.state.nit ? 'hide' : '')
                          }
                        >
                          <div
                            className={classNames(
                              'generofield no-icon form-group',
                              this.hasErrorAddClass('genero')
                            )}
                          >
                            <label htmlFor="doc-type-value">Genero</label>
                            <ul className="select-item">
                              <li
                                className={`${
                                  this.state.person.genero === 1
                                    ? 'active '
                                    : ''
                                }Si`}
                                onClick={this.generoChange(1)}
                              >
                                Masculino
                              </li>
                              <li
                                className={`${
                                  this.state.person.genero === 2
                                    ? 'active '
                                    : ''
                                }No`}
                                onClick={this.generoChange(2)}
                              >
                                Femenino
                              </li>
                            </ul>
                            <small className="form-text only-errors">
                              Falta información requerida para el Tomador. Por
                              favor revise el campo Genero
                            </small>
                          </div>
                        </div>
                      )}

                      {this.state.nit === false && typePerson !== 4 && (
                        <div
                          className={'col col-12 col-sm-12 col-md-6 col-lg-6'}
                        >
                          <DateInput
                            person={this.state.person}
                            changeDates={this.changeDates}
                            hasErrorAddClass={this.hasErrorAddClass}
                            isActived={this.isActived}
                          />
                        </div>
                      )}

                      {typePerson !== 4 &&
                        typePerson !== 5 &&
                        typePerson !== 6 && (
                          <React.Fragment>
                            <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                              <div
                                className={classNames(
                                  'pisonumero form-group input-select',
                                  this.hasErrorAddClass('tipodetelefono')
                                )}
                              >
                                <label htmlFor="tipodetelefono">
                                  Tipo de teléfono
                                </label>
                                <select
                                  name="tipodetelefono"
                                  onChange={this.changeValue}
                                  id="tipodetelefono"
                                  value={this.state.person.tipodetelefono}
                                  className={
                                    `form-control ${
                                      phoneTypes.mobilePhone !== 'Tfno. móvil'
                                        ? 'not-value'
                                        : ''
                                    }` +
                                    (this.state.person.tipodetelefonoDisabled
                                      ? 'disabled'
                                      : '')
                                  }
                                  disabled={
                                    this.state.person.tipodetelefonoDisabled ||
                                    Object.keys(phoneTypes).length < 2
                                  }
                                >
                                  <option value="">Seleccione</option>
                                  <option value={phoneTypes.mobilePhone}>
                                    Tfno. móvil
                                  </option>
                                </select>
                                <small className="form-text only-errors">
                                  Falta información requerida para el Tomador.
                                  Por favor revise el campo Tipo de teléfono
                                </small>
                              </div>
                            </div>
                            <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                              <div
                                className={classNames(
                                  'pisonumero form-group ',
                                  this.hasErrorAddClass('telefono')
                                )}
                              >
                                <label htmlFor="telefono">Teléfono</label>
                                <input
                                  type="text"
                                  className={
                                    `number form-control ${
                                      !this.state.person.telefono
                                        ? 'not-value'
                                        : ''
                                    }` +
                                    (this.state.person.telefonoDisabled
                                      ? 'disabled'
                                      : '')
                                  }
                                  disabled={this.state.person.telefonoDisabled}
                                  name="telefono"
                                  value={this.state.person.telefono}
                                  onChange={this.changeValue}
                                />
                                <small className="form-text only-errors">
                                  Falta información requerida para el Tomador.
                                  Por favor revise el campo Teléfono
                                </small>
                              </div>
                            </div>
                          </React.Fragment>
                        )}
                      {typePerson === 4 && (
                        <React.Fragment>
                          <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                            <div
                              className={classNames(
                                'businessname form-group ',
                                this.hasErrorAddClass('businessname')
                              )}
                            >
                              <label htmlFor="businessname">Razon social</label>
                              <input
                                type="text"
                                className={
                                  `form-control ${
                                    !this.state.person.businessname
                                      ? 'not-value'
                                      : ''
                                  }` +
                                  (this.state.person.businessnameDisabled
                                    ? 'disabled'
                                    : '')
                                }
                                disabled={
                                  this.state.person.businessnameDisabled
                                }
                                name="businessname"
                                value={this.state.person.businessname}
                                onChange={this.changeValue}
                              />
                              <small className="form-text only-errors">
                                Falta información requerida para el Tomador. Por
                                favor revise el campo Razon social
                              </small>
                            </div>
                          </div>

                          {this.isActived(fieldsNames.fechadecontitucion) && (
                            <div
                              className={
                                'col col-12 col-sm-12 col-md-6 col-lg-6'
                              }
                            >
                              <div
                                className={classNames(
                                  'fechadecontitucion form-group ',
                                  this.hasErrorAddClass(
                                    fieldsNames.fechadecontitucion
                                  )
                                )}
                              >
                                <label htmlFor="businessname">
                                  Fecha de constitución
                                </label>
                                <DatePicker
                                  name={fieldsNames.fechadecontitucion}
                                  value={this.state.person.fechadecontitucion}
                                  selected={this.state.fechadecontitucion}
                                  onChange={this.changeDates}
                                  showMonthDropdown
                                  showYearDropdown
                                  scrollableYearDropdown
                                  yearDropdownItemNumber={60}
                                  disabled={
                                    this.state.person.fechadecontitucionDisabled
                                  }
                                  className={
                                    `form-control ${
                                      !this.state.person.fechadecontitucion
                                        ? 'not-value'
                                        : ''
                                    }` +
                                    (this.state.person
                                      .fechadecontitucionDisabled
                                      ? 'disabled'
                                      : '')
                                  }
                                />
                                <small className="form-text only-errors">
                                  Falta información requerida para el Tomador.
                                  Por favor revise el campo Fecha de
                                  constitución
                                </small>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      )}
                      {typePerson !== 7 && (
                        <React.Fragment>
                          {this.isActived(fieldsNames.email) && (
                            <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                              <div
                                className={classNames(
                                  'email form-group ',
                                  this.hasErrorAddClass(fieldsNames.email)
                                )}
                              >
                                <label htmlFor={fieldsNames.email}>
                                  Correo electrónico
                                </label>
                                <input
                                  type="text"
                                  className={
                                    `form-control ${
                                      !this.state.person.email
                                        ? 'not-value'
                                        : ''
                                    }` +
                                    (this.state.person.emailDisabled
                                      ? 'disabled'
                                      : '')
                                  }
                                  placeholder="Correo electrónico"
                                  disabled={this.state.person.emailDisabled}
                                  name={fieldsNames.email}
                                  value={this.state.person.email}
                                  onChange={this.changeValue}
                                />
                                <small
                                  style={{ textAlign: 'left' }}
                                  className="form-text"
                                >
                                  Ejemplo: nombre@mail.com
                                </small>
                                {this.state.person.email !== '' && (
                                  <small className="form-text only-errors">
                                    {sessionStorage.getItem('errorEmail')}
                                  </small>
                                )}

                                {this.state.person.email === '' && (
                                  <small className="form-text only-errors">
                                    Este campo es requerido
                                  </small>
                                )}
                              </div>
                            </div>
                          )}

                          {this.isActived(fieldsNames.ciudad) && (
                            <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                              <div
                                className={classNames(
                                  'pisonumero form-group',
                                  this.hasErrorAddClass('ciudad')
                                )}
                              >
                                <AutocompleteCities
                                  disabled={this.state.person.ciudadDisabled}
                                  label={'Ciudad o municipio'}
                                  name="ciudad"
                                  value={this.state.person.ciudad}
                                  onChange={this.changeValue}
                                  hideTitle={false}
                                />
                              </div>
                            </div>
                          )}

                          {this.isActived(fieldsNames.adresstype) && (
                            <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                              <div
                                className={classNames(
                                  'pisonumero form-group input-select',
                                  this.hasErrorAddClass(fieldsNames.adresstype)
                                )}
                              >
                                <label htmlFor={fieldsNames.adresstype}>
                                  Tipo de dirección
                                </label>
                                <select
                                  value={this.state.person.adresstype}
                                  onChange={this.changeValue}
                                  name={fieldsNames.adresstype}
                                  id={fieldsNames.adresstype}
                                  className={
                                    `form-control ${
                                      !this.state.person.adresstype
                                        ? 'not-value'
                                        : ''
                                    }` +
                                    (this.state.person.emailDisabled
                                      ? 'disabled'
                                      : '')
                                  }
                                  disabled={
                                    this.state.person.adresstypeDisabled
                                  }
                                >
                                  <option value="">Seleccione</option>
                                  <option value="9">Residencia</option>
                                  <option value="10">Oficina Principal</option>
                                  <option value="11">Sede Principal</option>
                                  <option value="12">Sucursal</option>
                                  <option value="13">Correspondencia</option>
                                  <option value="14">Apartado Aereo</option>
                                </select>
                                <small className="form-text only-errors">
                                  Falta información requerida para el Tomador.
                                  Por favor revise el campo Tipo de dirección
                                </small>
                              </div>
                            </div>
                          )}
                          {this.isActived(fieldsNames.address) && (
                            <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                              <div
                                className={classNames(
                                  'pisonumero form-group',
                                  this.hasErrorAddClass(fieldsNames.address)
                                )}
                              >
                                <label htmlFor={fieldsNames.address}>
                                  Dirección
                                </label>
                                <input
                                  type="text"
                                  className={
                                    `form-control ${
                                      !this.state.person.address
                                        ? 'not-value'
                                        : ''
                                    }` +
                                    (this.state.person.addressDisabled
                                      ? 'disabled'
                                      : '')
                                  }
                                  disabled={this.state.person.addressDisabled}
                                  name={fieldsNames.address}
                                  value={this.state.person.address}
                                  onChange={this.changeValue}
                                  onKeyPress={this.validateChange}
                                />
                                <small className="form-text only-errors">
                                  {validationMessages.addressRegex}
                                </small>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      )}
                      {participationPercentages && (
                        <ParticipationPercentages
                          onChange={({ name, value }) => {
                            const { person } = this.state;
                            this.setState(
                              {
                                ...this.state,
                                person: {
                                  ...person,
                                  [name]: value,
                                },
                              },
                              () => {
                                this.validateAll(name);
                              }
                            );
                          }}
                          isActived={(field) => this.isActived(field)}
                          {...{ persons, item, person: this.state.person }}
                        />
                      )}
                    </div>

                    {isShowUploadFile &&
                      typeof this.props.disabledAll === 'undefined' && (
                        <UploadFiles
                          person={this.state.person}
                          showDefaultTextFile={this.state.showDefaultTextFile}
                          textFile={this.state.textFile}
                          onChangeFile={this.onChangeFile}
                          errorFile={this.state.errorFile}
                          typeFile={
                            isRequiredFileHabeasData
                              ? TYPES_FILES.HABEAS_DATA
                              : TYPES_FILES.SARLAFT
                          }
                          isError={this.hasErrorAddClass(
                            isRequiredFileHabeasData
                              ? TYPES_FILES.HABEAS_DATA
                              : TYPES_FILES.SARLAFT
                          )}
                        />
                      )}
                    {isShowUploadFilecerticate &&
                      typeof this.props.disabledAll === 'undefined' && (
                        <UploadFiles
                          person={this.state.person}
                          showDefaultTextFile={this.state.showDefaultTextFile}
                          onChangeFile={this.onChangeFile}
                          textFile={this.state.textFileCertificate}
                          errorFile={this.state.errorFileCertificate}
                          typeFile={TYPES_FILES.CERL}
                          isError={this.hasErrorAddClass(TYPES_FILES.CERL)}
                        />
                      )}
                    {isShowLegalRepresentativeAndBeneficiaries && (
                      <>
                        <LegalRepresentative
                          disabledAll={this.props.disabledAll}
                          LegalRepresentative={this.state.LegalRepresentative}
                          onChangeLegalRepresentative={() =>
                            this.setState({
                              ...this.state,
                              isLegalRepresentativeBeneficiary:
                                !this.state.isLegalRepresentativeBeneficiary,
                            })
                          }
                          handleChangeIsRestricted={() => {
                            this.setState({
                              ...this.state,
                              userRestricted: !this.userRestricted,
                            });
                          }}
                          isLegalRepresentativeBeneficiary={
                            this.state.isLegalRepresentativeBeneficiary
                          }
                          updateLegalRepresentative={(data) =>
                            this.setState({
                              ...this.state,
                              LegalRepresentative: data,
                            })
                          }
                        />

                        <BeneficiariesFinalPage
                          disabledAll={this.props.disabledAll}
                          beneficiariesFinal={this.state.beneficiariesFinal}
                          handleNewBeneficiaryFinal={
                            this.handleNewBeneficiaryFinal
                          }
                          handleUpdatedBeneficiaryData={(data, index) => {
                            let { beneficiariesFinal } = this.state;
                            beneficiariesFinal[index] = data;
                            this.setState({
                              ...this.state,
                              beneficiariesFinal,
                            });
                          }}
                          isLegalRepresentativeBeneficiary={
                            this.state.isLegalRepresentativeBeneficiary
                          }
                          handleDeleteBeneficiaryFinal={
                            this.handleDeleteBeneficiaryFinal
                          }
                        />
                      </>
                    )}
                    {typeof this.props.disabledAll === 'undefined' && (
                      <div className="row">
                        <div className="col">
                          <div className={'msj-total'}>
                            <p className="error no-margin">
                              Haz diligenciado correctamente {this.state.ok} de{' '}
                              {this.state.total} campos
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {typeof this.props.disabledAll === 'undefined' && (
                    <React.Fragment>
                      <div className="buttons">
                        {this.state.msj4 === true && typePerson === 7 && (
                          <p className="error">
                            Falta información requerida para el Contacto. Por
                            favor revise los detalles de los datos de Contacto
                          </p>
                        )}
                        <button
                          className={`btn ${
                            errors.length ? 'disabled' : 'btn-primary'
                          }`}
                          disabled={!!errors.length}
                          type="button"
                          onClick={() => {
                            this.validateAll(null, true, true);
                          }}
                        >
                          Continuar
                        </button>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Validaridentificacion
            toggle={this.props.toggle}
            changeValue={this.changeValuePopup}
          />
        </CitiesProvider>
      </React.Fragment>
    );
  }
}
