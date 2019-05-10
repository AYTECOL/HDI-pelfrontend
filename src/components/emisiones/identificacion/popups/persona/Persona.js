import React, {Component} from 'react';
import './Persona.scss';
import Loading from "../../../../../components/globals/loading/Loading";
import ConsultaPersonas from "../../../../../services/ConsultaPersonas";
import TypeDocuments from "../../../../cotizaciones/identificacion/forms/tipodocumento/TipoDocumento";
import Validaridentificacion from "../../../../cotizaciones/identificacion/popups/validaridentificacion/Validaridentificacion";
import AutocompleteCities from "../../../../cotizaciones/identificacion/forms/autocompletecities/AutocompleteCities";

export default class Persona extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showDefaultTextFile: true,
            textFile: "",
            genero: 0,
            exitsTomador: false,
            typePerson: this.props.typePerson,
            nit: false,
            userRestricted: false,
            person: {}
        };
        if( this.props.item !== -1) this.state.person = this.props.persons[this.props.item];
        for (let i = 0; i < this.props.persons.length; i++) if( this.props.persons[i]['role'].indexOf(1) !== -1 ) this.state.exitsTomador = true;

        if ( typeof this.state.person.value === "undefined" ) this.state.person.value = "";
        if ( typeof this.state.person.genero === "undefined" ) this.state.person.genero = "";
        if ( typeof this.state.person.name === "undefined" ) this.state.person.name = "";
        if ( typeof this.state.person.secondname === "undefined" ) this.state.person.secondname = "";
        if ( typeof this.state.person.lastname === "undefined" ) this.state.person.lastname = "";
        if ( typeof this.state.person.secondlastname === "undefined" ) this.state.person.secondlastname = "";
        if ( typeof this.state.person.fechadenacimiento === "undefined" ) this.state.person.fechadenacimiento = "";
        if ( typeof this.state.person.telefono === "undefined" ) this.state.person.telefono = "";
        if ( typeof this.state.person.email === "undefined" ) this.state.person.email = "";
        if ( typeof this.state.person.ciudad === "undefined" ) this.state.person.ciudad = "";
        if ( typeof this.state.person.address === "undefined" ) this.state.person.address = "";
        if ( typeof this.state.person.role === "undefined" ) this.state.person.role = [];
        if ( this.state.typePerson !== 3 ){
            if ( typeof this.state.person.code === "undefined" ) this.state.person.code = "36";
        } else {
            if ( typeof this.state.person.code === "undefined" ) this.state.person.code = "37";
            this.state.person.codeDisabled = true;
        }

        if ( typeof this.state.person.businessname === "undefined" ) this.state.person.businessname = "";
        if ( typeof this.state.person.sarlfaltActive === "undefined" ) this.state.person.sarlfaltActive = false;
        for(let i in this.state.person) if( typeof this.state.person[i+'Disabled'] === "undefined") this.state.person[i+'Disabled'] = false;
        console.log(this.state.person);
    }

    changeTextFile = e => {
        if (typeof e.target.files[0] !== "undefined") {
            this.setState({
                ...this.state,
                textFile: e.target.files[0].name,
                showDefaultTextFile: false
            })
        } else {
            this.setState({
                ...this.state,
                textFile: '',
                showDefaultTextFile: true
            })
        }
    };

    generoChange = index => e => {
        let newPerson = this.state.person;
        newPerson['genero'] = index;
        this.setState({
            ...this.state,
            genero: index,
            person: newPerson,
        });
    };

    changeRole = role => e => {
        let newPerson = this.state.person;
        if ( typeof newPerson['role'] === "undefined") newPerson['role'] = [];
        let roles = newPerson['role'];
        if( roles.indexOf(role) !== -1 ){
            let newRoles = [];
            for (let i = 0; i < roles.length; i++) if ( role !== roles[i] ) newRoles.push(roles[i]);
            roles = newRoles;
        } else {
            roles.push(role);
        }
        newPerson['role'] = roles;
        this.setState({
            ...this.state,
            person: newPerson,
        });
    };

    changeValue = e => {
        let v = e.target.value;
        let n = e.target.name;
        let nit = this.state.nit;
        let newPerson = this.state.person;
        newPerson[n] = v;
        if (n === 'code'){
            nit = parseInt(v) === 37;
        }
        this.setState({
            ...this.state,
            person: newPerson,
            nit: nit
        });
    };

     validateDoc = async e => {
        if ( this.state.person.value === "" ) return;
        let code = this.state.person.code;
        try {
            let persona = await ConsultaPersonas.get(this.state.person.code, this.state.person.value);
            Loading.toggle(true);
            if (persona.consultarPersonaRs.personaRestringida === true) {
                Validaridentificacion.toggle(true);
                this.setState({
                    ...this.state,
                    userRestricted: true
                });
            } else {
                let person = this.state.person;
                if (parseInt(code) === 37){
                    person.businessname = persona['consultarPersonaRs']['persona']['personaJuridica']['razonSocial'];
                    person.businessnameDisabled = true;
                } else {
                    person.genero = persona['consultarPersonaRs']['persona']['personaNatural']['genero']['codigo'];
                    person.generoDisabled = true;
                    person.name = persona['consultarPersonaRs']['persona']['personaNatural']['primerNombre'];
                    person.nameDisabled = true;
                    person.secondname = persona['consultarPersonaRs']['persona']['personaNatural']['segundoNombre'];
                    person.secondname = person.secondname === null ? '' : person.secondname;
                    person.secondnameDisabled = person.secondname!=='';
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
                    if ( contacto['idContacto'] === 1 ){
                        person.telefono = contacto['textoContacto'];
                        person.telefonoDisabled = true;
                    }else if( contacto['idContacto'] === 2 ){
                        person.email = contacto['textoContacto'];
                        person.emailDisabled = true;
                    }
                }
                
                person.ciudad = persona['consultarPersonaRs']['persona']['direccion'][0]['ciudad']['nombre'];
                person.ciudadDisabled = true;
                person.address = persona['consultarPersonaRs']['persona']['direccion'][0]['textoDireccion'];
                person.addressDisabled = true;
                person.sarlfaltActive = persona['consultarPersonaRs']['informacionSARLAFT']['vigente'];
                person.sarlfaltActiveDisabled = true;

                this.setState({
                    ...this.state,
                    person: person,
                    userRestricted: false
                });
                Loading.toggle(false);
            }
        }catch (e) {
            Loading.toggle(false);
        }
    };

    changeValuePopup = e => {
        let newPerson = this.state.person;
        newPerson.value = "";
        this.setState({
            ...this.state,
            person: newPerson,
        });
    };

    render() {
        return (
            <React.Fragment>
                <div className={"modal validaridentificacion show person-popup"}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className={"modal-header "+(this.state.typePerson===1||this.state.typePerson===3?'':'hide')}>
                                <h5 className="modal-title">Información adicional</h5>
                                <p className="modal-subtitle">Ingresa la información faltante, conocerla es importante para
                                    nosotros, no olvides asignar un rol</p>
                                <button type="button" className="close" aria-label="Close"
                                        onClick={this.props.toggle(0)}>&nbsp;</button>
                            </div>
                            <div className={"modal-header "+(this.state.typePerson===2?'':'hide')}>
                                <h5 className="modal-title">Personas adicionales</h5>
                                <p className="modal-subtitle">Ingresa la información de las persona, selecciona los amparos que deseas para ella</p>
                                <button type="button" className="close" aria-label="Close"
                                        onClick={this.props.toggle(0)}>&nbsp;</button>
                            </div>
                            <div className="modal-body">
                                <div className="content">
                                    <div className="row items-checkboxes justify-content-center">
                                        {this.state.typePerson === 1?(
                                            <React.Fragment>
                                                <div className="col col-sm-12 col-md-4 col-lg-4">
                                                    <input type="checkbox" name="asegurado" id="asegurado" value="1"
                                                           checked={this.state.person['role'].indexOf(2) !== -1}
                                                           onChange={this.changeRole(2)}
                                                           className="form-control"/>
                                                    <label htmlFor="asegurado">Asegurado</label>
                                                </div>
                                                <div className={"col col-sm-12 col-md-4 col-lg-4 "+(this.state.exitsTomador?'hide':'')}>
                                                    <input type="checkbox" name="tomado" id="tomado" value="2"
                                                           checked={this.state.person['role'].indexOf(1) !== -1}
                                                           onChange={this.changeRole(1)}
                                                           disabled={this.state.exitsTomador}
                                                           className={"form-control "+(this.state.exitsTomador?'disabled':'')}/>
                                                    <label htmlFor="tomado">Tomador</label>
                                                </div>
                                                <div className="col col-sm-12 col-md-4 col-lg-4">
                                                    <input type="checkbox" name="beneficiario" id="beneficiario" value="3"
                                                           checked={this.state.person['role'].indexOf(3) !== -1}
                                                           onChange={this.changeRole(3)}
                                                           className="form-control"/>
                                                    <label htmlFor="beneficiario">Beneficiario</label>
                                                </div>
                                            </React.Fragment>
                                        ):(
                                            <React.Fragment>
                                                {this.state.typePerson === 2?(
                                                    <React.Fragment>
                                                        <div className="col col-sm-12 col-md-6 col-lg-6">
                                                            <input type="checkbox" name="exequias" id="exequias" value="1"
                                                                   checked={this.state.person['role'].indexOf(5) !== -1}
                                                                   onChange={this.changeRole(5)}
                                                                   className="form-control"/>
                                                            <label htmlFor="exequias">Exequias</label>
                                                        </div>
                                                        <div className="col col-sm-12 col-md-6 col-lg-6">
                                                            <input type="checkbox" name="accidentes" id="accidentes" value="3"
                                                                   checked={this.state.person['role'].indexOf(6) !== -1}
                                                                   onChange={this.changeRole(6)}
                                                                   className="form-control"/>
                                                            <label htmlFor="accidentes">Accidentes personales</label>
                                                        </div>
                                                    </React.Fragment>
                                                ):(
                                                    <React.Fragment>
                                                        <div className="col col-sm-12 col-md-6 col-lg-6">
                                                            <input type="checkbox" name="oneroso" id="oneroso" value="1"
                                                                   checked={this.state.person['role'].indexOf(4) !== -1}
                                                                   onChange={this.changeRole(4)}
                                                                   className="form-control"/>
                                                            <label htmlFor="oneroso">Beneficiario oneroso</label>
                                                        </div>
                                                    </React.Fragment>
                                                )}
                                            </React.Fragment>
                                        )}
                                    </div>

                                    <div className="row fields-row">
                                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                            <TypeDocuments disabled={this.state.person.codeDisabled} value={this.state.person.code} onChange={this.changeValue} />
                                        </div>

                                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div className="value form-group "><label
                                                htmlFor="value">Identificación</label>
                                                <input type="text" className={"form-control "+(this.state.person.valueDisabled?'disabled':'')} disabled={this.state.person.valueDisabled} name="value" value={this.state.person.value}
                                                       onBlur={this.validateDoc} onChange={this.changeValue}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={"row fields-row "+(this.state.typePerson===1||this.state.typePerson===2?'':'hide')}>

                                        {this.state.nit===true?(
                                            <React.Fragment>
                                                <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                                                    <div className="name form-group "><label
                                                        htmlFor="name">Razón social</label>
                                                        <input type="text" className={"form-control "+(this.state.person.businessnameDisabled?'disabled':'')} disabled={this.state.person.businessnameDisabled} name="name" value={this.state.person.businessname} onChange={this.changeValue}/>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ):(
                                            <React.Fragment>
                                                <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                                    <div className="name form-group "><label
                                                        htmlFor="name">Primer nombre</label>
                                                        <input type="text" className={"form-control "+(this.state.person.nameDisabled?'disabled':'')} disabled={this.state.person.nameDisabled} name="name" value={this.state.person.name} onChange={this.changeValue}/>
                                                    </div>
                                                </div>
                                                <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                                    <div className="pisonumero form-group "><label
                                                        htmlFor="pisonumero">Segundo nombre</label>
                                                        <input type="text" className={"form-control "+(this.state.person.secondnameDisabled?'disabled':'')} disabled={this.state.person.secondnameDisabled} name="secondname" value={this.state.person.secondname} onChange={this.changeValue}/>
                                                    </div>
                                                </div>

                                                <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                                    <div className="pisonumero form-group "><label
                                                        htmlFor="pisonumero">Primer apellido</label>
                                                        <input type="text" className={"form-control "+(this.state.person.lastnameDisabled?'disabled':'')} disabled={this.state.person.lastnameDisabled} name="lastname" value={this.state.person.lastname} onChange={this.changeValue}/>
                                                    </div>
                                                </div>
                                                <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                                    <div className="pisonumero form-group "><label
                                                        htmlFor="pisonumero">Segundo apellido</label>
                                                        <input type="text" className={"form-control "+(this.state.person.secondlastnameDisabled?'disabled':'')} disabled={this.state.person.secondlastnameDisabled} name="secondlastname" value={this.state.person.secondlastname} onChange={this.changeValue}/>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        )}

                                        <div className={"col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right "+(this.state.nit?'hide':'')}>
                                            <div
                                                className={"inmuebleasegudadojoyas no-icon form-group " + this.state.error}>
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
                                            </div>
                                        </div>
                                        <div className={"col col-12 col-sm-12 col-md-6 col-lg-6 "+(this.state.nit?'hide':'')}>
                                            <div className="pisonumero form-group "><label
                                                htmlFor="fechadenacimiento">Fecha de nacimiento</label>
                                                <input type="text" className={"form-control "+(this.state.person.fechadenacimientoDisabled?'disabled':'')} disabled={this.state.person.fechadenacimientoDisabled} name="fechadenacimiento" value={this.state.person.fechadenacimiento} onChange={this.changeValue}/>
                                            </div>
                                        </div>

                                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                            <div className="pisonumero form-group "><label
                                                htmlFor="tipodetelefono">Tipo de teléfono</label>
                                                <select name="tipodetelefono" id="tipodetelefono" className="form-control">
                                                    <option value="">Seleccione</option>
                                                    <option value="fax">Fax</option>
                                                    <option value="fijo">Fijo</option>
                                                    <option value="celular">Celular</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div className="pisonumero form-group "><label
                                                htmlFor="telefono">Teléfono</label>
                                                <input type="text" className={"form-control "+(this.state.person.telefonoDisabled?'disabled':'')} disabled={this.state.person.telefonoDisabled} name="telefono" value={this.state.person.telefono} onChange={this.changeValue}/>
                                            </div>
                                        </div>

                                    </div>

                                    <div className={"row fields-row "+(this.state.typePerson!==3?'hide':'')}>

                                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                            <div className="businessname form-group "><label
                                                htmlFor="businessname">Razon social</label>
                                                <input type="text" className={"form-control "+(this.state.person.businessnameDisabled?'disabled':'')} disabled={this.state.person.businessnameDisabled} name="businessname" value={this.state.person.businessname} onChange={this.changeValue}/>
                                            </div>
                                        </div>

                                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div className="pisonumero form-group "><label
                                                htmlFor="pisonumero">Fecha de constitución</label>
                                                <input type="text" className={"form-control "+(this.state.person.emailDisabled?'disabled':'')} disabled={this.state.person.emailDisabled} name="fechadecontitucion" value={this.state.person.email} onChange={this.changeValue}/>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="row fields-row">
                                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                            <div className="pisonumero form-group "><label
                                                htmlFor="email">Correo electrónico</label>
                                                <input type="text" className={"form-control "+(this.state.person.emailDisabled?'disabled':'')} disabled={this.state.person.emailDisabled} name="email" value={this.state.person.email} onChange={this.changeValue}/>
                                            </div>
                                        </div>


                                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div className="pisonumero form-group "><label
                                                htmlFor="ciudad">Ciudad o municipio</label>
                                                <AutocompleteCities disabled={this.state.person.ciudadDisabled} name="ciudad" value={this.state.person.ciudad} onChange={this.changeValue} hideTitle={true}/>
                                            </div>
                                        </div>


                                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                                            <div className="pisonumero form-group "><label
                                                htmlFor="adresstype">Tipo de dirección</label>
                                                <select name="adresstype" id="adresstype" className="form-control">
                                                    <option value="">Seleccione</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div className="pisonumero form-group "><label
                                                htmlFor="address">Dirección</label>
                                                <input type="text" className={"form-control "+(this.state.person.addressDisabled?'disabled':'')} disabled={this.state.person.addressDisabled} name="address" value={this.state.person.address} onChange={this.changeValue}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={"row sarlaft "+(this.state.typePerson!==1||this.state.person.sarlfaltActive===true?'hide':'')}>
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
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="buttons">
                                    <button className="btn btn-primary" type="button" onClick={this.props.updatePerson(this.state.person)}>Continuar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Validaridentificacion toggle={this.props.toggle} changeValue={this.changeValuePopup}/>
            </React.Fragment>
        )
    };
}