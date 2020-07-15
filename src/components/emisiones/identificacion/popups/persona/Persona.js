import React, { Component } from 'react';
import classNames from 'classnames';
import MomentJs from "moment";
import DatePicker from "react-datepicker";
import es from 'react-datepicker/node_modules/date-fns/esm/locale/es/index';

import './Persona.scss';
import Loading from "../../../../../components/globals/loading/Loading";
import ConsultaPersonas from "../../../../../services/ConsultaPersonas";
import TypeDocuments from "../../../../cotizaciones/identificacion/forms/tipodocumento/TipoDocumento";
import Validaridentificacion
    from "../../../../cotizaciones/identificacion/popups/validaridentificacion/Validaridentificacion";
import AutocompleteCities from "../../../../cotizaciones/identificacion/forms/autocompletecities/AutocompleteCities";
import UploadFile from "../../../../../services/UploadFile";
import CheckBoxes from './Checkboxes';
import Helpers from "../../../../../common/helpers/helpers/Helpers";
import NumeroIdentificacion
    from "../../../../cotizaciones/identificacion/forms/numeroidentificacion/NumeroIdentificacion";
import { isValidDirection, validationMessages } from '../../../../../common/validations';

// 6.5MB
const maxFileSize = 6500000;
const phoneTypes = {
    mobilePhone: '6'
}

export default class Persona extends Component {

    _isMounted = false;
    validateAllTime = null;

    constructor(props) {
        super(props);
        this.state = {
            showDefaultTextFile: true,
            textFile: "",
            genero: 0,
            exitsTomador: false,
            typePerson: this.props.typePerson,
            nit: false,
            personExists: false,
            userRestricted: false,
            ok: 0,
            total: 9,
            errorFile: null,
            person: {},
            fields: [
                "role",
                "code",
                "value",
                "name",
                "name",
                "secondname",
                "lastname",
                "secondlastname",
                "fechadenacimiento",
                "tipodetelefono",
                "telefono",
                "genero",
                "businessname",
                "fechadecontitucion",
                "email",
                "ciudad",
                "sarlfaltActive",
                "adresstype",
                "address",
                "sarlaft",
            ]
        };
        if (this.props.item !== -1 && typeof this.props.persons[this.props.item] !== "undefined") this.state.person = this.props.persons[this.props.item];
        for (let i = 0; i < this.state.fields.length; i++) {
            let key = this.state.fields[i];
            if (typeof this.state.person[key] === "undefined") {
                if (key === "role") {
                    this.state.person[key] = [];
                } else if (key === "sarlfaltActive") {
                    this.state.person[key] = false;
                } else if (key === "code") {
                    this.state.person[key] = this.state.typePerson === 4 ? '37' : '36';
                } else {
                    this.state.person[key] = "";
                }
                this.state.person[key + "Disabled"] = false;
                this.state.person[key + "Error"] = false;
            } else if (this.state.person[key] === null) {
                this.state.person[key] = "";
            }
        }
        for (let i = 0; i < this.props.persons.length; i++) {
            if (typeof this.props.persons[i]['role'] !== "undefined") {
                if (this.props.persons[i]['role'].indexOf(1) !== -1) this.state.exitsTomador = true;
            }
        }

        if (this.state.typePerson === 1 || this.state.typePerson === 3 || this.state.typePerson === 2) {
            this.state.total = 15;
        } else if (this.state.typePerson === 7) {
            this.state.total = 3;
        } else if (this.state.typePerson === 4) {
            this.state.total = 8;
        } else if (this.state.typePerson === 5 || this.state.typePerson === 6) {
            this.state.total = 11;
        }

        if (typeof this.props.disabledAll !== "undefined") {
            for (let i in this.state.person) {
                this.state.person[i + "Disabled"] = true;
            }
        }

        if (typeof this.state.person !== "undefined" && typeof this.state.person['city_code'] === "undefined" && typeof this.state.person['department_code'] === "undefined") {
            this.state.person['city_code'] = 0;
            this.state.person['department_code'] = 0;
        }

        if (this.state.typePerson !== 4 && this.state.typePerson !== 2 && String(this.state.person.code) === "37") {
            this.state.nit = true;
        }
        if (typeof this.state.person.sarlfalt_url !== 'string') {
            this.state.person.sarlfalt_url = "";
        }

        if (typeof this.state.person.object !== "undefined" || typeof this.state.person.person !== "undefined") {
            this.state.hideLoader = true;
        } else {
            this.state.hideLoader = undefined;
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
            if (typeof consultarPersonaRs !== "undefined") {
                if (typeof persona !== "undefined") {
                    if (typeof persona['personaJuridica'] !== "undefined") {
                        if (typeof persona['personaJuridica']['razonSocial'] !== "undefined") {
                            person.businessname = persona['personaJuridica']['razonSocial'];
                            person.businessname = person.businessname == null ? '' : person.businessname;
                            person.businessnameDisabled = person.businessname !== '' && person.businessname !== null;
                        }
                        if (typeof persona['personaJuridica']['fechaConstitucion'] !== "undefined") {
                            person.fechadecontitucion = persona['personaJuridica']['fechaConstitucion'];
                            person.fechadecontitucion = person.fechadecontitucion !== null ? person.fechadecontitucion.split("T") : '';
                            person.fechadecontitucion = typeof person.fechadecontitucion[0] !== "undefined" ? person.fechadecontitucion[0] : '';
                            person.fechadecontitucionDisabled = person.fechadecontitucion !== '';
                        }
                        person.valueDisabled = true;
                        person.codeDisabled = true;
                    }
                }
            }
        } else {
            if (typeof consultarPersonaRs !== "undefined") {
                if (typeof persona !== "undefined") {
                    if (typeof persona['personaNatural'] !== "undefined") {
                        if (typeof person.genero === "undefined" || person.genero === "") {
                            person.genero = persona['personaNatural']['genero']['codigo'];
                            person.genero = person.genero === null ? '' : person.genero;
                            person.generoDisabled = person.genero !== '' && person.genero !== null;
                        }

                        if (typeof person.name === "undefined" || person.name === "") {
                            person.name = persona['personaNatural']['primerNombre'];
                            person.name = person.name === null ? '' : person.name;
                            person.nameDisabled = person.name !== '' && person.name !== null;
                        }

                        if (typeof person.secondname === "undefined" || person.secondname === "") {
                            person.secondname = persona['personaNatural']['segundoNombre'];
                            person.secondname = person.secondname === null ? '' : person.secondname;
                            person.secondnameDisabled = person.secondname !== '' && person.secondname !== null;
                        }

                        if (typeof person.lastname === "undefined" || person.lastname === "") {
                            person.lastname = persona['personaNatural']['primerApellido'];
                            person.lastname = person.lastname === null ? '' : person.lastname;
                            person.lastnameDisabled = person.lastname !== '' && person.lastname !== null;
                        }

                        if (typeof person.secondlastname === "undefined" || person.secondlastname === "") {
                            person.secondlastname = persona['personaNatural']['segundoApellido'];
                            person.secondlastname = person.secondlastname === null ? '' : person.secondlastname;
                            person.secondlastnameDisabled = person.secondlastname !== '' && person.secondlastname !== null;
                        }

                        person.valueDisabled = true;
                        person.codeDisabled = true;

                        if (typeof person.fechadenacimiento === "undefined" || person.fechadenacimiento === "") {
                            person.fechadenacimiento = persona['personaNatural']['fechaNacimiento'];
                            person.fechadenacimiento = person.fechadenacimiento !== null ? person.fechadenacimiento.split("T") : '';
                            person.fechadenacimiento = typeof person.fechadenacimiento[0] !== "undefined" ? person.fechadenacimiento[0] : '';
                            person.fechadenacimientoDisabled = person.fechadenacimiento !== '' && person.fechadenacimiento !== null;
                        }

                        person.personaNatural = persona['personaNatural'];
                    }
                }
            }
        }
        if (typeof consultarPersonaRs !== "undefined") {
            if (typeof persona !== "undefined") {
                const contactos = persona['contacto'];
                if (typeof contactos !== "undefined") {
                    person.contacto = [];
                    person.tipoPersona = persona['tipoPersona'];
                    if (!person.email) {
                      const lastEmail = contactos.reduce(
                        (previousValue, currentValue) =>
                          previousValue
                            ? currentValue.tipoContacto.codigo === 3 &&
                              Helpers.validationEmail(currentValue.textoContacto) &&
                              currentValue.idContacto > previousValue.idContacto
                              ? currentValue
                              : previousValue
                            : currentValue,
                        null
                      );
                      person.email = lastEmail && lastEmail.textoContacto;
                    }
                    if (!person.telefono) {
                      const codesPhone = [1, 2, 3];
                      const lastPhone = contactos.reduce(
                        (prevValue, contact) => {
                          const tipoContacto = contact.tipoContacto.codigo;
                          if (!prevValue) return contact;
                          if (
                            codesPhone.find(
                              (value) => String(tipoContacto) === String(value)
                            ) &&
                            contact.idContacto > prevValue.idContacto &&
                            Helpers.isNumber(contact.textoContacto)
                          )
                            return contact;
                          return prevValue;
                        },
                        null
                      );
                      if (lastPhone) {
                        const tipoContacto = lastPhone.tipoContacto.codigo;
                        person.telefono = lastPhone.textoContacto;
                        person.tipodetelefono = !!Object.values(
                          phoneTypes
                        ).find((type) => String(type) === String(tipoContacto))
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
                      ? direction.idDireccion > previousValue.idDireccion
                        ? direction
                        : previousValue
                      : direction,
                  null
                );
                person.direccion = direcciones;
                if (!!lastDireccion) {
                  const { departamento, ciudad } = lastDireccion;
                  if (!person.ciudad)
                    person.address = lastDireccion['textoDireccion'];
                  if (!!ciudad) {
                    if (!person.ciudad)
                      person.ciudad = ciudad['nombre'];
                    if (!person.city_code)
                      person.city_code = ciudad['codigo'];
                  }
                  if (!!departamento) {
                    if (!person.departamento)
                      person.departamento = departamento['nombre'];
                    if (!person.department_code)
                      person.department_code = departamento['codigo'];
                  }
                  if (!!lastDireccion['tipoDireccion']) {
                    if (!person.adresstype)
                      person.adresstype =
                        lastDireccion['tipoDireccion']['codigo'];
                  }
                }

                person.sarlfaltActive =
                  consultarPersonaRs['informacionSARLAFT']['vigente'];
                person.sarlfaltActiveDisabled = true;
            }
        }
        return person;
    };

    componentDidMount() {
        this._isMounted = true;
        Helpers.fieldNumeric();
        let personObject = this.state.person;
        if (typeof personObject.person !== 'undefined')
            personObject.object = personObject.person;
        if (
          typeof personObject.object !== 'undefined' &&
          this.props.item !== -1
        )
          this.validateDoc({ person: personObject.person }, () => {
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
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    changeTextFile = e => {
        let name = "";
        let status = true;
        let errorFile = null;
        let person = this.state.person;
        person.sarlaft = undefined;
        person.sarlaft_document_url = undefined;
        person.sarlfalt_url = undefined;
        /**
         * @type {File}
         */
        const file = e.target.files[0];
        let validFile = Helpers.validateFile(file);
        if (!file) {
          errorFile = 'Este campo es requerido';
        } else if (!validFile) {
          errorFile = 'Formato no permitido';
        } else if (file.size >= maxFileSize) {
            errorFile = `El tamaño del archivo no debe exceder ${(
                maxFileSize / 1000000
            ).toFixed(1)}MB`;
        } else {
            name = file.name;
            status = false;
            person.sarlaft = file;
            person.sarlaft_document_url = person.sarlaft;
            person.sarlfalt_url = undefined;
        }
        this.setState(
          {
            ...this.state,
            textFile: name,
            errorFile,
            showDefaultTextFile: status,
            person: person,
            sarlfalt_url: undefined,
          },
          () => {
            this.validateAll('sarlaft');
          }
        );
    };

    generoChange = index => () => {
        if (this.state.person.generoDisabled !== true) {
            this.changeValue({
                target: {
                    name: 'genero',
                    value: index
                }
            });
        }
    };

    changeDates = e => {
        this.changeValue({
            target: {
                name: (this.state.typePerson === 4) ? 'fechadecontitucion' : 'fechadenacimiento',
                value: MomentJs(e).format("YYYY-MM-DD")
            }
        });
    };

    changeValue = e => {
        let v = e.target.value;
        let n = e.target.name;
        let nit = this.state.nit;
        let newPerson = this.state.person;
        newPerson[n] = v;
        if (n === 'code') nit = parseInt(v) === 37;
        this.setState({
            ...this.state,
            person: newPerson,
            nit: nit
        }, () => {
            this.validateAll(n);
        });
    };

    validateDoc = async (e, callback) => {
        if (this.state.person.value === "") return;
        if (this.state.typePerson === 5 || this.state.typePerson === 6) return;
        let code = this.state.person.code;
        try {
            if (typeof e.target !== "undefined" && e.target.parentNode.className.indexOf('error') !== -1) {
                return;
            }
            Loading.toggle(true);
            let persona = null;
            if (typeof e.person === "undefined") {
                persona = await ConsultaPersonas.get(this.state.person.code, this.state.person.value);
            } else {
                persona = e.person;
            }
            if (persona !== null && persona.consultarPersonaRs.personaRestringida === true) {
                Loading.toggle(false);
                Validaridentificacion.toggle(true);
                this.setState(
                  {
                    ...this.state,
                    userRestricted: true,
                  },
                  callback
                );
            } else {
                let person = this.state.person;
                person = Persona.extractDataFromIaxis(persona, code, person);
                person.person = persona;
                this.setState({
                    ...this.state,
                    person: person,
                    userRestricted: false,
                    personExists: true
                }, () => {
                  Loading.toggle(false);
                  callback && callback();
                });
            }
        } catch (e) {
            if (this.state.personExists) {
                let updatePerson = this.state.person;
                for (let i in updatePerson) {
                    if (i.indexOf('Disabled') !== -1 || i.indexOf('Error') !== -1) {
                        updatePerson[i] = false;
                    } else {
                        if (i !== 'value' && i !== 'code' && i !== 'role') updatePerson[i] = "";
                    }
                }
                this.setState(
                  {
                    ...this.state,
                    person: updatePerson,
                    userRestricted: false,
                  },
                  callback
                );
            }
            Loading.toggle(false);
        }
    };

    changeValuePopup = () => {
        let newPerson = this.state.person;
        newPerson.value = "";
        this.setState({
            ...this.state,
            person: newPerson,
        });
    };

    saveFile = async () => {
        if (this.state.typePerson <= 3 && typeof this.state.person.sarlfalt_url === "undefined") {
            let person = this.state.person;
            let file = await UploadFile.upload("Sarlaft", person.sarlaft);
            if (typeof file['location'] !== "undefined") {
                person.sarlaft = file['location'];
                person.sarlaft_document_url = file['location'];
                person.sarlfalt_url = file['location'];
                this.setState({
                    ...this.state,
                    person: person
                });
            }
        }
    };

    getErrors() {
        const errors = [];
        const { typePerson, nit, person, errorFile } = this.state;
        const { sarlfaltActive, email, sarlfalt_url, sarlaft, genero, fechadenacimiento, fechadecontitucion, role } = person;
        const address = String(person.address);
        const tipodetelefono = String(person.tipodetelefono);
        const telefono = String(person.telefono);
        let fields = document.querySelectorAll(".modal-content input, .modal-content select");
        for (let i = 0; i < fields.length; i++) {
          if (sarlfaltActive === true && fields[i].name === "sarlaft") continue;
          if (fields[i].value === "" && fields[i].getAttribute("type") !== "checkbox" && fields[i].name !== "secondname" && fields[i].name !== "secondlastname") {
            errors.push(fields[i].name);
          }
        }

        let telefonoHasError = false;
        if (tipodetelefono === phoneTypes.mobilePhone) {
          if (Helpers.isMobilePhone(telefono)) {
            telefonoHasError = true;
          }
        } else errors.push('tipodetelefono');
        if (!telefono || telefonoHasError) errors.push('telefono');

        if (Helpers.validationEmail(email) === false) errors.push("email");

        if (typeof sarlfalt_url !== "undefined" && sarlaft === "" && sarlfalt_url !== "") {
          errors.splice(errors.indexOf("sarlfalt"), 1);
        }
        if (typePerson === 1 && nit === false) {
          if (genero === "") {
            errors.push("genero");
          }
        }
        if ((typePerson === 1 || typePerson === 2) && nit === false) {
          if (fechadenacimiento === "") {
            errors.push("fechadenacimiento");
          }
        }
        if (typePerson === 4) {
          if (fechadecontitucion === "") {
            errors.push("fechadecontitucion");
          }
        }
        if (typePerson !== 4 && typePerson !== 7) {
          if (role.length === 0)  errors.push("role");
        }

        let indexSecondName = errors.indexOf("secondname");
        if (indexSecondName !== -1) errors.splice(indexSecondName, 1);

        let sarlaftError = errors.indexOf("sarlaft");
        if (sarlaftError !== -1 && typeof sarlfalt_url !== "undefined" && sarlfalt_url !== null) {
          if (sarlfalt_url.trim() !== "") {
            errors.splice(sarlaftError, 1);
          }
        }
        if (errorFile) {
          errors.push('sarlfalt');
        }
        if (!address || !isValidDirection(address) || address.length < 5)
          errors.push('address');
        return errors;
    }

    hasValidForm() {
        return !this.getErrors().length;
    }

    async validateAll(name = null, printErrors = false, saveData = false) {
        try {
            if (typeof this.props.updatePerson !== "undefined") {
                if (typeof printErrors === "undefined") printErrors = false;
                let msj4 = true;
                let total = this.state.total;
                if (this.state.typePerson !== 4 && this.state.typePerson !== 7) {
                    if (this.state.nit === true) {
                        total = 11;
                    } else {
                        total = 15;
                    }
                }

                let v = document.querySelector('#documentfield').value;
                if (v !== "") {
                    let type = document.querySelector('#doc-type').value;
                    let errorStatus = NumeroIdentificacion.validate(v, type);
                    if (errorStatus === true) {
                        document.querySelector('#documentfield').parentNode.className += " error";
                    } else {
                        document.querySelector('#documentfield').parentNode.className = document.querySelector('#documentfield').parentNode.className.replace(' error', '');
                    }
                }


                const errors = this.getErrors();
                const valid = !errors.length;
                if (valid) msj4 = false;
                if (valid && saveData) {
                    await this.saveFile();
                    let state = this.state;
                    if (typeof state.person.code === "undefined") state.person.code = state.typePerson !== 4 ? '36' : '37';
                    if (state.typePerson === 4) state.person.role.push(4);

                    this.props.updatePerson(state.person);
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
            console.log(e);
        }
    };
    validateChange = event => {
        if (!isValidDirection(event.key)) {
          event.preventDefault();
          return false;
        }
      }
    render() {
        const errors = this.getErrors()
        const hasErrorAddClass = (field) => errors.find((error) => field === error) && "error ";
        return (
            <React.Fragment>
                <div className={"modal validaridentificacion show person-popup"}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div
                                className={"modal-header " + (this.state.typePerson <= 4 ? '' : 'hide')}>
                                <h5 className="modal-title">Información adicional</h5>
                                <p className="modal-subtitle">Ingresa la información faltante, conocerla es importante
                                    para
                                    nosotros, no olvides asignar un rol</p>
                                <button type="button" className="close" aria-label="Close"
                                    onClick={this.props.toggle(0)}>&nbsp;</button>
                            </div>
                            <div
                                className={"modal-header " + (this.state.typePerson === 5 || this.state.typePerson === 6 ? '' : 'hide')}>
                                <h5 className="modal-title">Personas adicionales</h5>
                                <p className="modal-subtitle">Ingresa la información de las persona, selecciona los
                                    amparos que deseas para ella</p>
                                <button type="button" className="close" aria-label="Close"
                                    onClick={this.props.toggle(0)}>&nbsp;</button>
                            </div>
                            <div className="modal-body">
                                <div className="content">

                                    <CheckBoxes person={this.state.person}
                                        changeValue={this.changeValue}
                                        typePerson={this.props.typePerson}
                                        disabledAll={this.props.disabledAll}
                                        exitsTomador={this.state.exitsTomador}
                                        hasAccident={this.props.hasAccident}
                                        hasExequias={this.props.hasExequias} />

                                    {this.state.typePerson !== 7 &&
                                        <div className="row fields-row">
                                            <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                                <TypeDocuments
                                                    disabled={this.state.person.codeDisabled || this.state.typePerson === 4}
                                                    hideLoader={this.state.hideLoader}
                                                    value={this.state.person.code} onChange={this.changeValue} />
                                            </div>

                                            <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                                <div className={classNames( "value form-group ", hasErrorAddClass("documentfield"))}><label
                                                    htmlFor="value">Identificación</label>
                                                    <input type="text"
                                                        id="documentfield"
                                                        className={"form-control " + ((this.state.person.valueDisabled) ? 'disabled' : '')}
                                                        disabled={this.state.person.valueDisabled} name="value"
                                                        value={this.state.person.value} 
                                                        onBlur={(e) => {
                                                            this.validateDoc(
                                                                e,
                                                                () => this.validateAll()
                                                            );
                                                        }}
                                                        onChange={this.changeValue} />
                                                    <small className="form-text only-errors">Falta información requerida
                                                        para el Tomador. Por favor revise el campo Identificación
                                                </small>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {this.state.typePerson === 7 &&
                                        <div className={"row fields-row"}>
                                            <div
                                                className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                                <div className={classNames("name form-group ", hasErrorAddClass("name"))}><label
                                                    htmlFor="name">Nombre y Apellidos del Contacto</label>
                                                    <input type="text"
                                                        className={"form-control " + (this.state.person.nameDisabled ? 'disabled' : '')}
                                                        disabled={this.state.person.nameDisabled} name="name"
                                                        value={this.state.person.name}
                                                        onChange={this.changeValue} />
                                                    <small className="form-text only-errors">Falta información
                                                        requerida para el Tomador. Por favor revise el campo Primer
                                                        nombre
                                                </small>
                                                </div>
                                            </div>
                                            <div
                                                className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                                <div className={classNames("name form-group ", hasErrorAddClass("telefono"))}><label
                                                    htmlFor="telefono">Número de teléfono del Contacto</label>
                                                    <input type="text"
                                                        className={"form-control " + (this.state.person.telefonoDisabled ? 'disabled' : '')}
                                                        disabled={this.state.person.telefonoDisabled} name="telefono"
                                                        value={this.state.person.telefono}
                                                        onChange={this.changeValue} />
                                                    <small className="form-text only-errors">Falta información
                                                        requerida para el Tomador. Por favor revise el campo Primer
                                                        nombre
                                                </small>
                                                </div>
                                            </div>
                                            <div
                                                className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                                <div className={classNames("email form-group ", hasErrorAddClass("email"))}><label
                                                    htmlFor="email">Correo electrónico del Contacto</label>
                                                    <input type="text"
                                                        className={"form-control " + (this.state.person.emailDisabled ? 'disabled' : '')}
                                                        disabled={this.state.person.emailDisabled} name="email"
                                                        value={this.state.person.email}
                                                        onChange={this.changeValue} />
                                                    <small className="form-text only-errors">Falta información
                                                        requerida para el Tomador. Por favor revise el campo Primer
                                                        nombre
                                                </small>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    <div className={"row fields-row"}>
                                        {this.state.nit === true ? (
                                            <React.Fragment>
                                                <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                                                    <div className={classNames("name form-group ", hasErrorAddClass("businessname"))}><label
                                                        htmlFor="name">Razón social</label>
                                                        <input type="text"
                                                            className={"form-control " + (this.state.person.businessnameDisabled ? 'disabled' : '')}
                                                            disabled={this.state.person.businessnameDisabled}
                                                            name="businessname"
                                                            value={this.state.person.businessname}
                                                            onChange={this.changeValue} />
                                                        <small className="form-text only-errors">Falta información
                                                            requerida para el Tomador. Por favor revise el campo Razón
                                                            social
                                                        </small>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ) : (
                                                <React.Fragment>
                                                    {this.state.typePerson !== 4 &&
                                                        <React.Fragment>
                                                            <div
                                                                className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                                                <div className={classNames("name form-group ", hasErrorAddClass('name'))}><label
                                                                    htmlFor="name">Primer nombre</label>
                                                                    <input type="text"
                                                                        className={"form-control " + (this.state.person.nameDisabled ? 'disabled' : '')}
                                                                        disabled={this.state.person.nameDisabled} name="name"
                                                                        value={this.state.person.name}
                                                                        onChange={this.changeValue} />
                                                                    <small className="form-text only-errors">Falta información
                                                                        requerida para el Tomador. Por favor revise el campo
                                                                        Primer
                                                                        nombre
                                                            </small>
                                                                </div>
                                                            </div>
                                                            <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                                                <div className={classNames("pisonumero form-group ", hasErrorAddClass('secondname'))}><label
                                                                    htmlFor="pisonumero">Segundo nombre</label>
                                                                    <input type="text"
                                                                        className={"form-control " + (this.state.person.secondnameDisabled ? 'disabled' : '')}
                                                                        disabled={this.state.person.secondnameDisabled}
                                                                        name="secondname"
                                                                        value={this.state.person.secondname}
                                                                        onChange={this.changeValue} />
                                                                    <small className="form-text only-errors">Falta información
                                                                        requerida para el Tomador. Por favor revise el campo
                                                                        Segundo
                                                                        nombre
                                                            </small>
                                                                </div>
                                                            </div>

                                                            <div
                                                                className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                                                <div className={classNames("pisonumero form-group ", hasErrorAddClass('lastname'))}><label
                                                                    htmlFor="pisonumero">Primer apellido</label>
                                                                    <input type="text"
                                                                        className={"form-control " + (this.state.person.lastnameDisabled ? 'disabled' : '')}
                                                                        disabled={this.state.person.lastnameDisabled}
                                                                        name="lastname" value={this.state.person.lastname}
                                                                        onChange={this.changeValue} />
                                                                    <small className="form-text only-errors">Falta información
                                                                        requerida para el Tomador. Por favor revise el campo
                                                                        Primer
                                                                        apellido
                                                            </small>
                                                                </div>
                                                            </div>
                                                            <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                                                <div className={classNames("pisonumero form-group ", hasErrorAddClass('secondlastname'))}><label
                                                                    htmlFor="pisonumero">Segundo apellido</label>
                                                                    <input type="text"
                                                                        className={"form-control " + (this.state.person.secondlastnameDisabled ? 'disabled' : '')}
                                                                        disabled={this.state.person.secondlastnameDisabled}
                                                                        name="secondlastname"
                                                                        value={this.state.person.secondlastname}
                                                                        onChange={this.changeValue} />
                                                                    <small className="form-text only-errors">Falta información
                                                                        requerida para el Tomador. Por favor revise el campo
                                                                        Segundo
                                                                        apellido
                                                            </small>
                                                                </div>
                                                            </div>
                                                        </React.Fragment>
                                                    }
                                                </React.Fragment>
                                            )}

                                        {(this.state.typePerson !== 4) &&
                                            <div
                                                className={"col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right " + (this.state.nit ? 'hide' : '')}>
                                                <div className={classNames("generofield no-icon form-group", hasErrorAddClass('genero'))}>
                                                    <label htmlFor="doc-type-value">Genero</label>
                                                    <ul className="select-item">
                                                        <li className={((this.state.person.genero === 1) ? 'active' : '')}
                                                            onClick={this.generoChange(1)}
                                                        >Masculino
                                                    </li>
                                                        <li className={((this.state.person.genero === 2) ? 'active' : '')}
                                                            onClick={this.generoChange(2)}
                                                        >Femenino
                                                    </li>
                                                    </ul>
                                                    <small className="form-text only-errors">Falta información requerida
                                                        para el Tomador. Por favor revise el campo Genero
                                                </small>
                                                </div>
                                            </div>
                                        }

                                        {(this.state.nit === false && this.state.typePerson !== 4) &&
                                            <div
                                                className={"col col-12 col-sm-12 col-md-6 col-lg-6"}>
                                                <div className={classNames("fechadenacimiento form-group ", hasErrorAddClass('fechadenacimiento'))}><label
                                                    htmlFor="fechadenacimiento">Fecha de nacimiento</label>
                                                    <DatePicker locale={es}
                                                        name="fechadenacimiento"
                                                        value={this.state.person.fechadenacimiento}
                                                        onChange={this.changeDates}
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        scrollableYearDropdown
                                                        yearDropdownItemNumber={100}
                                                        maxDate={new Date()}
                                                        disabled={this.state.person.fechadenacimientoDisabled}
                                                        className={"form-control " + (this.state.person.fechadenacimientoDisabled ? 'disabled' : '')} />
                                                    <small className="form-text only-errors">Falta información requerida
                                                        para el Tomador. Por favor revise el campo Fecha de nacimiento
                                                </small>
                                                </div>
                                            </div>
                                        }

                                        {(this.state.typePerson !== 4 && this.state.typePerson !== 5 && this.state.typePerson !== 6) &&
                                            <React.Fragment>
                                                <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                                    <div className={classNames("pisonumero form-group input-select", hasErrorAddClass('tipodetelefono'))}><label
                                                        htmlFor="tipodetelefono">Tipo de teléfono</label>
                                                        <select name="tipodetelefono" onChange={this.changeValue}
                                                            id="tipodetelefono" value={this.state.person.tipodetelefono}
                                                            className={"form-control " + (this.state.person.tipodetelefonoDisabled ? 'disabled' : '')}
                                                            disabled={this.state.person.tipodetelefonoDisabled}>
                                                            <option value="">Seleccione</option>
                                                            <option value={phoneTypes.mobilePhone}>Tfno. móvil</option>
                                                        </select>
                                                        <small className="form-text only-errors">Falta información requerida
                                                            para el Tomador. Por favor revise el campo Tipo de teléfono
                                                    </small>
                                                    </div>
                                                </div>
                                                <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                                    <div className={classNames("pisonumero form-group ", hasErrorAddClass('telefono'))}><label
                                                        htmlFor="telefono">Teléfono</label>
                                                        <input type="text"
                                                            className={"number form-control " + (this.state.person.telefonoDisabled ? 'disabled' : '')}
                                                            disabled={this.state.person.telefonoDisabled} name="telefono"
                                                            value={this.state.person.telefono}
                                                            onChange={this.changeValue} />
                                                        <small className="form-text only-errors">Falta información requerida
                                                            para el Tomador. Por favor revise el campo Teléfono
                                                    </small>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        }
                                    </div>

                                    {this.state.typePerson === 4 &&
                                        <div className={"row fields-row"}>

                                            <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                                <div className={classNames("businessname form-group ", hasErrorAddClass('businessname'))}><label
                                                    htmlFor="businessname">Razon social</label>
                                                    <input type="text"
                                                        className={"form-control " + (this.state.person.businessnameDisabled ? 'disabled' : '')}
                                                        disabled={this.state.person.businessnameDisabled}
                                                        name="businessname" value={this.state.person.businessname}
                                                        onChange={this.changeValue} />
                                                    <small className="form-text only-errors">Falta información requerida
                                                        para el Tomador. Por favor revise el campo Razon social
                                                </small>
                                                </div>
                                            </div>

                                            <div className={"col col-12 col-sm-12 col-md-6 col-lg-6"}>
                                                <div className={classNames("fechadecontitucion form-group ", hasErrorAddClass("fechadecontitucion"))}>
                                                    <label htmlFor="businessname">Fecha de constitución</label>
                                                    <DatePicker name="fechadecontitucion"
                                                        value={this.state.person.fechadecontitucion}
                                                        selected={this.state.fechadecontitucion}
                                                        onChange={this.changeDates}
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        scrollableYearDropdown
                                                        yearDropdownItemNumber={60}
                                                        disabled={this.state.person.fechadecontitucionDisabled}
                                                        className={"form-control " + (this.state.person.fechadecontitucionDisabled ? 'disabled' : '')} />
                                                    <small className="form-text only-errors">Falta información requerida
                                                        para el Tomador. Por favor revise el campo Fecha de constitución
                                                </small>
                                                </div>
                                            </div>

                                        </div>
                                    }

                                    {this.state.typePerson !== 7 &&
                                        <div className="row fields-row">
                                            <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                                <div className={classNames("email form-group ", hasErrorAddClass('email'))}><label
                                                    htmlFor="email">Correo electrónico</label>
                                                    <input type="text"
                                                        className={"form-control " + (this.state.person.emailDisabled ? 'disabled' : '')}
                                                        disabled={this.state.person.emailDisabled} name="email"
                                                        value={this.state.person.email} onChange={this.changeValue} />
                                                    <small className="form-text only-errors">Falta información requerida
                                                        para el Tomador. Por favor revise el campo Correo electrónico
                                                </small>
                                                </div>
                                            </div>


                                            <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                                <div className={classNames("pisonumero form-group", hasErrorAddClass('ciudad'))}>
                                                    <AutocompleteCities disabled={this.state.person.ciudadDisabled}
                                                        label={"Ciudad o municipio"} name="ciudad"
                                                        value={this.state.person.ciudad}
                                                        onChange={this.changeValue} hideTitle={false} />
                                                </div>
                                            </div>


                                            <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                                <div className={classNames("pisonumero form-group input-select", hasErrorAddClass('adresstype'))}><label
                                                    htmlFor="adresstype">Tipo de dirección</label>
                                                    <select value={this.state.person.adresstype} onChange={this.changeValue}
                                                        name="adresstype" id="adresstype"
                                                        className={"form-control " + (this.state.person.emailDisabled ? 'disabled' : '')}
                                                        disabled={this.state.person.adresstypeDisabled}>
                                                        <option value="">Seleccione</option>
                                                        <option value="9">Residencia</option>
                                                        <option value="10">Oficina Principal</option>
                                                        <option value="11">Sede Principal</option>
                                                        <option value="12">Sucursal</option>
                                                        <option value="13">Correspondencia</option>
                                                        <option value="14">Apartado Aereo</option>
                                                    </select>
                                                    <small className="form-text only-errors">Falta información requerida
                                                        para el Tomador. Por favor revise el campo Tipo de dirección
                                                </small>
                                                </div>
                                            </div>
                                            <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                                <div className={classNames("pisonumero form-group", errors.find((error) => "address" === error) && "error")}>
                                                    <label htmlFor="address">Dirección</label>
                                                    <input
                                                     type="text"
                                                     className={"form-control " + (this.state.person.addressDisabled ? 'disabled' : '')}
                                                     disabled={this.state.person.addressDisabled} name="address"
                                                     value={this.state.person.address} onChange={this.changeValue} onKeyPress={this.validateChange}
                                                    />
                                                    <small className="form-text only-errors">
                                                        {validationMessages.addressRegex}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {(this.state.typePerson <= 3 && this.state.person.sarlfaltActive === false && typeof this.props.disabledAll === "undefined") &&
                                        <div
                                            className={"row sarlaft"}>
                                            <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                                                <div className={classNames("sarlaft form-group", hasErrorAddClass('sarlaft'))}>
                                                    <label htmlFor="address">Es necesario el sarlaft</label>
                                                    <span>Adjunta el Sarlaft diligenciado</span>
                                                    <input type="file" className="form-control" name="sarlaft"
                                                        onChange={this.changeTextFile}  accept={Helpers.fileFormats.join(', ')+ ", .docx, .doc"} />
                                                    {this.state.showDefaultTextFile ? (
                                                        <p>Arrastre archivos para adjuntar, o <b>buscar</b></p>
                                                    ) : (
                                                            <p>{this.state.textFile}</p>
                                                        )}
                                                    <span>Formatos permitidos PDF, PNG, GIF, JPG</span>
                                                    {typeof this.state.person.sarlfalt_url !== "undefined" &&
                                                        <React.Fragment>
                                                            <br />
                                                            <span><a
                                                                href={this.state.person.sarlfalt_url}>{this.state.person.sarlfalt_url.split('/').slice(-1)}</a></span>
                                                        </React.Fragment>
                                                    }
                                                    <br />
                                                    {this.state.errorFile && (
                                                     <div className="animated shake">
                                                        <span className="error-file">
                                                        {this.state.errorFile}
                                                        </span>
                                                     </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {typeof this.props.disabledAll === "undefined" &&
                                        <div className="row">
                                            <div className="col">
                                                <div className={"msj-total"}>
                                                    <p className="error no-margin">
                                                     Haz diligenciado correctamente {this.state.ok} de {this.state.total} campos
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                </div>

                                {typeof this.props.disabledAll === "undefined" &&
                                    <React.Fragment>
                                        <div className="buttons">
                                            {(this.state.msj4 === true && this.state.typePerson === 7) &&
                                                <p className="error">Falta información requerida para el Contacto. Por favor
                                            revise los detalles de los datos de Contacto</p>
                                            }
                                            <button className="btn btn-primary" disabled={!!errors.length} type="button" onClick={() => {
                                                this.validateAll(null, true, true)
                                            }}>Continuar
                                        </button>
                                        </div>
                                    </React.Fragment>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Validaridentificacion toggle={this.props.toggle} changeValue={this.changeValuePopup} />
            </React.Fragment>
        )
    };
}
