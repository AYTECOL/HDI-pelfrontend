import React, {Component} from 'react';
import './Persona.scss';
import Loading from "../../../../../components/globals/loading/Loading";
import ConsultaPersonas from "../../../../../services/ConsultaPersonas";
import TypeDocuments from "../../../../cotizaciones/identificacion/forms/tipodocumento/TipoDocumento";
import Validaridentificacion
    from "../../../../cotizaciones/identificacion/popups/validaridentificacion/Validaridentificacion";
import AutocompleteCities from "../../../../cotizaciones/identificacion/forms/autocompletecities/AutocompleteCities";
import MomentJs from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'react-datepicker/node_modules/date-fns/esm/locale/es/index';
import UploadFile from "../../../../../services/UploadFile";
import CheckBoxes from './Checkboxes';
import Helpers from "../../../../../common/helpers/helpers/Helpers";
import store from "../../../../../store";

export default class Persona extends Component {

    _isMounted = false;

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
            errorFile: false,
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
            }
        }
        for (let i = 0; i < this.props.persons.length; i++) {
            if (typeof this.props.persons[i]['role'] !== "undefined") {
                if (this.props.persons[i]['role'].indexOf(1) !== -1) this.state.exitsTomador = true;
            }
        }

        if (this.state.typePerson === 1 || this.state.typePerson === 3 || this.state.typePerson === 2) {
            this.state.total = 16;
        } else if (this.state.typePerson === 7) {
            this.state.total = 3;
        } else if (this.state.typePerson === 4) {
            this.state.total = 8;
        }

        if (typeof this.props.disabledAll !== "undefined") {
            for (let i in this.state.person) {
                this.state.person[i + "Disabled"] = true;
            }
        }

        if( typeof this.state.person !== "undefined" && typeof this.state.person['city_code'] === "undefined" && typeof this.state.person['department_code'] === "undefined"){
            this.state.person['city_code'] = 0;
            this.state.person['department_code'] = 0;
        }

        if (this.state.typePerson !== 4 && this.state.typePerson !== 2 && this.state.person.code === "37") {
            this.state.nit = true;
        }
    }

    componentDidMount() {
        this._isMounted = true;
        setTimeout(() => {
            if (this._isMounted) {
                this.validateAll(null, false, false);
                let personObject = store.getState().cotizacion.identification.object;
                if (typeof personObject !== "undefined" && this.props.item !== -1) {
                    this.validateDoc({
                        person: personObject
                    });
                }
            }
        }, 600);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    changeTextFile = e => {
        let name = "";
        let status = true;
        let errorFile = false;
        let person = this.state.person;
        let validFile = Helpers.validateFile(e.target.files[0]);
        if (validFile) {
            name = e.target.files[0].name;
            status = false;
            person.sarlaft = e.target.files[0];
        } else {
            errorFile = true;
        }
        this.setState({
            ...this.state,
            textFile: name,
            errorFile: errorFile,
            showDefaultTextFile: status,
            person: person,
            sarlfalt_url: undefined
        });
        setTimeout(() => {
            this.validateAll('sarlaft');
        }, 250);
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
        });
        setTimeout(() => {
            this.validateAll(n);
        }, 500);
    };

    validateDoc = async e => {

        if (this.state.person.value === "") return;
        if (this.state.typePerson === 2) return;
        let code = this.state.person.code;
        try {
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
                this.setState({
                    ...this.state,
                    userRestricted: true
                });
            } else {
                let person = this.state.person;
                person.person = persona;
                if (parseInt(code) === 37) {
                    person.businessname = persona['consultarPersonaRs']['persona']['personaJuridica']['razonSocial'];
                    person.businessnameDisabled = true;
                } else {
                    person.genero = persona['consultarPersonaRs']['persona']['personaNatural']['genero']['codigo'];
                    person.generoDisabled = true;
                    person.name = persona['consultarPersonaRs']['persona']['personaNatural']['primerNombre'];
                    person.nameDisabled = true;
                    person.secondname = persona['consultarPersonaRs']['persona']['personaNatural']['segundoNombre'];
                    person.secondname = person.secondname === null ? '' : person.secondname;
                    person.secondnameDisabled = person.secondname !== '';
                    person.lastname = persona['consultarPersonaRs']['persona']['personaNatural']['primerApellido'];
                    person.lastnameDisabled = true;
                    person.secondlastname = persona['consultarPersonaRs']['persona']['personaNatural']['segundoApellido'];
                    person.secondlastnameDisabled = true;
                    person.fechadenacimiento = persona['consultarPersonaRs']['persona']['personaNatural']['fechaNacimiento'].split("T")[0];
                    person.fechadenacimientoDisabled = true;
                }
                let contactos = persona['consultarPersonaRs']['persona']['contacto'];
                for (let i = 0; i < contactos.length; i++) {
                    let contacto = contactos[i];
                    if (contacto['idContacto'] === 1) {
                        person.telefono = contacto['textoContacto'];
                    } else if (contacto['idContacto'] === 2) {
                        person.email = contacto['textoContacto'];
                    }
                }
                if (typeof contactos[0] !== "undefined") {
                    person.tipodetelefono = contactos[0]['tipoContacto']['codigo'];
                }

                if (typeof persona['consultarPersonaRs']['persona']['direccion'] !== "undefined") {
                    if (typeof persona['consultarPersonaRs']['persona']['direccion'][0] !== "undefined") {
                        person.address = persona['consultarPersonaRs']['persona']['direccion'][0]['textoDireccion'];

                        if (typeof persona['consultarPersonaRs']['persona']['direccion'][0]['ciudad'] !== "undefined") {
                            person.ciudad = persona['consultarPersonaRs']['persona']['direccion'][0]['ciudad']['nombre'];
                        }
                        if (typeof persona['consultarPersonaRs']['persona']['direccion'][0]['tipoDireccion'] !== "undefined") {
                            person.adresstype = persona['consultarPersonaRs']['persona']['direccion'][0]['tipoDireccion']['codigo'];
                        }
                    }
                }

                person.sarlfaltActive = persona['consultarPersonaRs']['informacionSARLAFT']['vigente'];
                person.sarlfaltActiveDisabled = true;
                this.setState({
                    ...this.state,
                    person: person,
                    userRestricted: false,
                    personExists: true
                });

                Loading.toggle(false);
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
                this.setState({
                    ...this.state,
                    person: updatePerson,
                    userRestricted: false,
                });
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
        if (this.state.typePerson === 1 && typeof this.state.person.sarlfalt_url === "undefined") {
            let person = this.state.person;
            let file = await UploadFile.upload("Sarlaft", person.sarlaft);
            if (typeof file['location'] !== "undefined") {
                person.sarlaft = file['location'];
                this.setState({
                    ...this.state,
                    person: person
                });
            }
        }
    };

    async validateAll(name, printErrors, saveData) {
        if (typeof this.props.updatePerson !== "undefined") {
            if (typeof printErrors === "undefined") printErrors = false;
            let msj4 = true;
            let errors = [];
            let fields = document.querySelectorAll(".modal-content input, .modal-content select");
            for (let i = 0; i < fields.length; i++) {
                fields[i].parentElement.className = fields[i].parentElement.className.replace(' error', '');
                if (fields[i].value === "" && fields[i].getAttribute('type') !== 'checkbox') {
                    errors.push(fields[i].name);
                    if (printErrors || fields[i].name === name) fields[i].parentElement.className += " error";
                }
            }
            if (typeof this.state.person.sarlfalt_url !== "undefined" && this.state.person.sarlaft === "") {
                errors.splice(errors.indexOf('sarlfalt'), 1);
                Helpers.removeClass('.sarlaft.error', 'error');
            }
            if (this.state.typePerson === 1 && this.state.nit === false) {
                if (this.state.person.genero === "") {
                    errors.push('genero');
                    if (printErrors || 'genero' === name) document.querySelector(".generofield").className += " error";
                } else {
                    document.querySelector(".generofield").className = document.querySelector(".generofield").className.replace(' error', '');
                }
            }
            if ((this.state.typePerson === 1 || this.state.typePerson === 2) && this.state.nit === false) {
                if (this.state.person.fechadenacimiento === "") {
                    errors.push('fechadenacimiento');
                    if (printErrors || 'fechadenacimiento' === name) document.querySelector(".fechadenacimiento").className += " error";
                } else {
                    document.querySelector(".fechadenacimiento").className = document.querySelector(".fechadenacimiento").className.replace(' error', '');
                }
            }
            if (this.state.typePerson === 4) {
                if (this.state.person.fechadecontitucion === "") {
                    errors.push('fechadecontitucion');
                    if (printErrors || 'fechadecontitucion' === name) document.querySelector(".fechadecontitucion").className += " error";
                } else {
                    document.querySelector(".fechadecontitucion").className = document.querySelector(".fechadecontitucion").className.replace(' error', '');
                }
            }
            if (this.state.typePerson !== 4 && this.state.typePerson !== 7) {
                if (this.state.person.role.length === 0) {
                    errors.push('role');
                    if (printErrors || 'role' === name) document.querySelector(".items-checkboxes").className += " error";
                } else {
                    document.querySelector(".items-checkboxes").className = document.querySelector(".items-checkboxes").className.replace(' error', '');
                }
            }
            let total = this.state.total;
            if (this.state.typePerson !== 4 && this.state.typePerson !== 7) {
                if (this.state.nit === true) {
                    total = 11;
                } else {
                    total = 16;
                }
            }
            let ok = total - errors.length;
            if (errors.length === 0) msj4 = false;
            if (errors.length === 0 && saveData) {
                await this.saveFile();
                let state = this.state;
                if (typeof state.person.code === "undefined") state.person.code = state.typePerson !== 4 ? '36' : '37';
                if (state.typePerson === 4) state.person.role.push(4);
                this.props.updatePerson(state.person);
            } else {
                this.setState({
                    ...this.state,
                    ok: ok,
                    msj4: msj4,
                    total: total
                })
            }
        }
    };

    render() {
        return (
            <React.Fragment>
                <div className={"modal validaridentificacion show person-popup"}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div
                                className={"modal-header " + (this.state.typePerson === 1 || this.state.typePerson === 3 ? '' : 'hide')}>
                                <h5 className="modal-title">Información adicional</h5>
                                <p className="modal-subtitle">Ingresa la información faltante, conocerla es importante
                                    para
                                    nosotros, no olvides asignar un rol</p>
                                <button type="button" className="close" aria-label="Close"
                                        onClick={this.props.toggle(0)}>&nbsp;</button>
                            </div>
                            <div
                                className={"modal-header " + (this.state.typePerson === 2 || this.state.typePerson === 4 ? '' : 'hide')}>
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
                                                hasExequias={this.props.hasExequias}/>

                                    {this.state.typePerson !== 7 &&
                                    <div className="row fields-row">
                                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                            <TypeDocuments
                                                disabled={this.state.person.codeDisabled || this.state.typePerson === 4}
                                                value={this.state.person.code} onChange={this.changeValue}/>
                                        </div>

                                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div className="value form-group "><label
                                                htmlFor="value">Identificación</label>
                                                <input type="text"
                                                       className={"form-control " + ((this.state.person.valueDisabled) ? 'disabled' : '')}
                                                       disabled={this.state.person.valueDisabled} name="value"
                                                       value={this.state.person.value} onBlur={this.validateDoc}
                                                       onChange={this.changeValue}/>
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
                                            <div className="name form-group "><label
                                                htmlFor="name">Nombre y Apellidos del Contacto</label>
                                                <input type="text"
                                                       className={"form-control " + (this.state.person.nameDisabled ? 'disabled' : '')}
                                                       disabled={this.state.person.nameDisabled} name="name"
                                                       value={this.state.person.name}
                                                       onChange={this.changeValue}/>
                                                <small className="form-text only-errors">Falta información
                                                    requerida para el Tomador. Por favor revise el campo Primer
                                                    nombre
                                                </small>
                                            </div>
                                        </div>
                                        <div
                                            className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                            <div className="name form-group "><label
                                                htmlFor="telefono">Número de teléfono del Contacto</label>
                                                <input type="text"
                                                       className={"form-control " + (this.state.person.telefonoDisabled ? 'disabled' : '')}
                                                       disabled={this.state.person.telefonoDisabled} name="telefono"
                                                       value={this.state.person.telefono}
                                                       onChange={this.changeValue}/>
                                                <small className="form-text only-errors">Falta información
                                                    requerida para el Tomador. Por favor revise el campo Primer
                                                    nombre
                                                </small>
                                            </div>
                                        </div>
                                        <div
                                            className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                            <div className="email form-group "><label
                                                htmlFor="email">Correo electrónico del Contacto</label>
                                                <input type="text"
                                                       className={"form-control " + (this.state.person.emailDisabled ? 'disabled' : '')}
                                                       disabled={this.state.person.emailDisabled} name="email"
                                                       value={this.state.person.email}
                                                       onChange={this.changeValue}/>
                                                <small className="form-text only-errors">Falta información
                                                    requerida para el Tomador. Por favor revise el campo Primer
                                                    nombre
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                    }

                                    {(this.state.typePerson === 1 || this.state.typePerson === 2 || this.state.typePerson === 3 || this.state.typePerson === 4) &&
                                    <div className={"row fields-row"}>
                                        {this.state.nit === true ? (
                                            <React.Fragment>
                                                <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                                                    <div className="name form-group "><label
                                                        htmlFor="name">Razón social</label>
                                                        <input type="text"
                                                               className={"form-control " + (this.state.person.businessnameDisabled ? 'disabled' : '')}
                                                               disabled={this.state.person.businessnameDisabled}
                                                               name="businessname"
                                                               value={this.state.person.businessname}
                                                               onChange={this.changeValue}/>
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
                                                        <div className="name form-group "><label
                                                            htmlFor="name">Primer nombre</label>
                                                            <input type="text"
                                                                   className={"form-control " + (this.state.person.nameDisabled ? 'disabled' : '')}
                                                                   disabled={this.state.person.nameDisabled} name="name"
                                                                   value={this.state.person.name}
                                                                   onChange={this.changeValue}/>
                                                            <small className="form-text only-errors">Falta información
                                                                requerida para el Tomador. Por favor revise el campo
                                                                Primer
                                                                nombre
                                                            </small>
                                                        </div>
                                                    </div>
                                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                                        <div className="pisonumero form-group "><label
                                                            htmlFor="pisonumero">Segundo nombre</label>
                                                            <input type="text"
                                                                   className={"form-control " + (this.state.person.secondnameDisabled ? 'disabled' : '')}
                                                                   disabled={this.state.person.secondnameDisabled}
                                                                   name="secondname"
                                                                   value={this.state.person.secondname}
                                                                   onChange={this.changeValue}/>
                                                            <small className="form-text only-errors">Falta información
                                                                requerida para el Tomador. Por favor revise el campo
                                                                Segundo
                                                                nombre
                                                            </small>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                                        <div className="pisonumero form-group "><label
                                                            htmlFor="pisonumero">Primer apellido</label>
                                                            <input type="text"
                                                                   className={"form-control " + (this.state.person.lastnameDisabled ? 'disabled' : '')}
                                                                   disabled={this.state.person.lastnameDisabled}
                                                                   name="lastname" value={this.state.person.lastname}
                                                                   onChange={this.changeValue}/>
                                                            <small className="form-text only-errors">Falta información
                                                                requerida para el Tomador. Por favor revise el campo
                                                                Primer
                                                                apellido
                                                            </small>
                                                        </div>
                                                    </div>
                                                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                                        <div className="pisonumero form-group "><label
                                                            htmlFor="pisonumero">Segundo apellido</label>
                                                            <input type="text"
                                                                   className={"form-control " + (this.state.person.secondlastnameDisabled ? 'disabled' : '')}
                                                                   disabled={this.state.person.secondlastnameDisabled}
                                                                   name="secondlastname"
                                                                   value={this.state.person.secondlastname}
                                                                   onChange={this.changeValue}/>
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
                                            <div className={"generofield no-icon form-group"}>
                                                <label htmlFor="doc-type-value">Genero</label>
                                                <ul className="select-item">
                                                    <li className={((this.state.person.genero === 1) ? 'active' : '')}
                                                        onClick={this.generoChange(1)}
                                                    >Masculino
                                                    </li>
                                                    <li className={((this.state.person.genero === 0) ? 'active' : '')}
                                                        onClick={this.generoChange(0)}
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
                                            <div className="fechadenacimiento form-group "><label
                                                htmlFor="fechadenacimiento">Fecha de nacimiento</label>
                                                <DatePicker locale={es}
                                                            name="fechadenacimiento"
                                                            value={this.state.person.fechadenacimiento}
                                                            onChange={this.changeDates}
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            disabled={this.state.person.fechadenacimientoDisabled}
                                                            className={"form-control " + (this.state.person.fechadenacimientoDisabled ? 'disabled' : '')}/>
                                                <small className="form-text only-errors">Falta información requerida
                                                    para el Tomador. Por favor revise el campo Fecha de nacimiento
                                                </small>
                                            </div>
                                        </div>
                                        }

                                        {(this.state.typePerson !== 4) &&
                                        <React.Fragment>
                                            <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                                <div className="pisonumero form-group input-select"><label
                                                    htmlFor="tipodetelefono">Tipo de teléfono</label>
                                                    <select name="tipodetelefono" onChange={this.changeValue}
                                                            id="tipodetelefono" value={this.state.person.tipodetelefono}
                                                            className={"form-control " + (this.state.person.tipodetelefonoDisabled ? 'disabled' : '')}
                                                            disabled={this.state.person.tipodetelefonoDisabled}>
                                                        <option value="">Seleccione</option>
                                                        <option value="1">Teléfono</option>
                                                        <option value="6">Tfno. móvil</option>
                                                    </select>
                                                    <small className="form-text only-errors">Falta información requerida
                                                        para el Tomador. Por favor revise el campo Tipo de teléfono
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                                <div className="pisonumero form-group "><label
                                                    htmlFor="telefono">Teléfono</label>
                                                    <input type="text"
                                                           className={"form-control " + (this.state.person.telefonoDisabled ? 'disabled' : '')}
                                                           disabled={this.state.person.telefonoDisabled} name="telefono"
                                                           value={this.state.person.telefono}
                                                           onChange={this.changeValue}/>
                                                    <small className="form-text only-errors">Falta información requerida
                                                        para el Tomador. Por favor revise el campo Teléfono
                                                    </small>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                        }
                                    </div>
                                    }

                                    {this.state.typePerson === 4 &&
                                    <div className={"row fields-row"}>

                                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                            <div className="businessname form-group "><label
                                                htmlFor="businessname">Razon social</label>
                                                <input type="text"
                                                       className={"form-control " + (this.state.person.businessnameDisabled ? 'disabled' : '')}
                                                       disabled={this.state.person.businessnameDisabled}
                                                       name="businessname" value={this.state.person.businessname}
                                                       onChange={this.changeValue}/>
                                                <small className="form-text only-errors">Falta información requerida
                                                    para el Tomador. Por favor revise el campo Razon social
                                                </small>
                                            </div>
                                        </div>

                                        <div className={"col col-12 col-sm-12 col-md-6 col-lg-6"}>
                                            <div className="fechadecontitucion form-group ">
                                                <label htmlFor="businessname">Fecha de constitución</label>
                                                <DatePicker name="fechadecontitucion"
                                                            value={this.state.person.fechadecontitucion}
                                                            selected={this.state.fechadecontitucion}
                                                            onChange={this.changeDates}
                                                            disabled={this.state.person.fechadecontitucionDisabled}
                                                            className={"form-control " + (this.state.person.fechadecontitucionDisabled ? 'disabled' : '')}/>
                                                <small className="form-text only-errors">Falta información requerida
                                                    para el Tomador. Por favor revise el campo Fecha de constitución
                                                </small>
                                            </div>
                                        </div>

                                    </div>
                                    }

                                    {(this.state.typePerson !== 6 && this.state.typePerson !== 7) &&
                                    <div className="row fields-row">
                                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                            <div className="pisonumero form-group "><label
                                                htmlFor="email">Correo electrónico</label>
                                                <input type="text"
                                                       className={"form-control " + (this.state.person.emailDisabled ? 'disabled' : '')}
                                                       disabled={this.state.person.emailDisabled} name="email"
                                                       value={this.state.person.email} onChange={this.changeValue}/>
                                                <small className="form-text only-errors">Falta información requerida
                                                    para el Tomador. Por favor revise el campo Correo electrónico
                                                </small>
                                            </div>
                                        </div>


                                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div className="pisonumero form-group">
                                                <AutocompleteCities disabled={this.state.person.ciudadDisabled}
                                                                    label={"Ciudad o municipio"} name="ciudad"
                                                                    value={this.state.person.ciudad}
                                                                    onChange={this.changeValue} hideTitle={false}/>
                                            </div>
                                        </div>


                                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                            <div className="pisonumero form-group input-select"><label
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
                                            <div className="pisonumero form-group "><label
                                                htmlFor="address">Dirección</label>
                                                <input type="text"
                                                       className={"form-control " + (this.state.person.addressDisabled ? 'disabled' : '')}
                                                       disabled={this.state.person.addressDisabled} name="address"
                                                       value={this.state.person.address} onChange={this.changeValue}/>
                                                <small className="form-text only-errors">Falta información requerida
                                                    para el Tomador. Por favor revise el campo Dirección
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                    }
                                    {(this.state.typePerson === 1 && this.state.person.sarlfaltActive === false && typeof this.props.disabledAll === "undefined") &&
                                    <div
                                        className={"row sarlaft"}>
                                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                                            <div className="sarlaft form-group">
                                                <label htmlFor="address">Es necesario el sarlaft</label>
                                                <span>Adjunta el Sarlaft diligenciado</span>
                                                <input type="file" className="form-control" name="sarlaft"
                                                       onChange={this.changeTextFile}/>
                                                {this.state.showDefaultTextFile ? (
                                                    <p>Arrastre archivos para adjuntar, o <b>buscar</b></p>
                                                ) : (
                                                    <p>{this.state.textFile}</p>
                                                )}
                                                <span>Formatos permitidos PDF, PNG, GIF, JPG</span>
                                                {typeof this.state.person.sarlfalt_url !== "undefined" &&
                                                <React.Fragment>
                                                    <br/>
                                                    <span><a
                                                        href={this.state.person.sarlfalt_url}>{this.state.person.sarlfalt_url.split('/').slice(-1)}</a></span>
                                                </React.Fragment>
                                                }
                                                <br/>
                                                <span
                                                    className={"error-file " + (this.state.errorFile === true ? 'show' : 'hide')}>Formato no permitido</span>
                                            </div>
                                        </div>
                                    </div>
                                    }

                                    {typeof this.props.disabledAll === "undefined" &&
                                    <div className="row">
                                        <div className="col">
                                            <div className={"msj-total"}>
                                                <p className="error no-margin">Haz
                                                    diligenciado {this.state.ok} de {this.state.total} campos</p>
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
                                        <button className="btn btn-primary" type="button" onClick={() => {
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
                <Validaridentificacion toggle={this.props.toggle} changeValue={this.changeValuePopup}/>
            </React.Fragment>
        )
    };
}
