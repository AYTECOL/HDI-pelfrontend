import Api from './Api';
import {UrlCrearpolizaiaxis} from "../config";
import momentJs from 'moment';
import ConsultaPersonas from './ConsultaPersonas';
import {
  isRoleParticipation,
  fieldsParticipation,
} from '../components/emisiones/identificacion/popups/persona/ParticipationPercentages/utils';

const BaseUrl = "/crearpolizaiaxis";
const Url = UrlCrearpolizaiaxis;

class Crearpolizaiaxis {

    /**
     * @param {(string|number)[]} value
     */
    static getValue(...value) {
        return value.find((v) => String(v || '').trim()) || ' ';
    }

    /**
     * 
     * @param {import('./QuoteIussedById').Taker[]} persons 
     */
    static formatPerson(persons) {
        let arrayToMerge = [];
        for (var i = 0; i < persons.length; i++) {
            let d = persons[i];

            if (typeof d.personaNatural === "undefined") {
                d.personaNatural = {
                    "estadoCivil": {
                        "nombre": " ",
                        "codigo": 0
                    },
                    "ocupacion": {
                        "nombre": " ",
                        "codigo": 0
                    }
                }
            }

            if (typeof d.tipoPersona === "undefined") {
                if (typeof d.document_type === "undefined" || d.document_type === null) {
                    d.tipoPersona = {
                        "codigo": 1
                    }
                } else {
                    if (d.document_type.toString() === "37") {
                        d.tipoPersona = {
                            "codigo": 2
                        }
                    } else {
                        d.tipoPersona = {
                            "codigo": 1
                        }
                    }
                }
            }

            if (typeof d.telefono === "undefined") {
                if (typeof d.phone === "undefined") {
                    d.telefono = 0;
                } else {
                    d.telefono = d.phone;
                }
            }

            if (typeof d.fechadenacimiento === "undefined") {
                if (typeof d.birthdate !== "undefined") {
                    d.fechadenacimiento = d.birthdate;
                } else {
                    d.fechadenacimiento = '1948-03-06';
                }
            }
            if (d.fechadenacimiento.trim() === "" || d.fechadenacimiento === null) d.fechadenacimiento = '1948-03-06';
            d.fechadenacimiento = momentJs(d.fechadenacimiento).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

            if (typeof d.tipodetelefono === "undefined" || d.tipodetelefono === null) {
                if (typeof d.phone_type === "undefined" || d.phone_type === null) {
                    d.tipodetelefono = " ";
                } else {
                    d.tipodetelefono = d.phone_type;
                }
            }
            let segundoApellido = this.getValue(d.secondlastname, d.second_last_name);
            let segundoNombre = this.getValue(d.secondname, d.second_name);
            let personAdd = {
                "personaNatural": {
                    "primerApellido": this.getValue(d.first_last_name),
                    "primerNombre": this.getValue(d.first_name),
                    segundoApellido,
                    segundoNombre,
                    "genero": {
                        "codigo": typeof d.genero === "undefined" || d.genero === null || d.genero === ' ' ? '1' : d.genero.toString(),
                    },
                    "fechaNacimiento": d.fechadenacimiento,
                    "estadoCivil": {
                        "codigo": typeof d.personaNatural.estadoCivil.codigo === "undefined" || d.personaNatural.estadoCivil.codigo === null ? '1' : d.personaNatural.estadoCivil.codigo.toString(),
                    },
                    "ocupacion": {
                        "codigo": typeof d.personaNatural.ocupacion.codigo === "undefined" || d.personaNatural.ocupacion.codigo === null ? '1' : d.personaNatural.ocupacion.codigo.toString(),
                    }
                }
            };
            if (d.tipoPersona.codigo.toString() === "2") {
                if (typeof d.businessname === "undefined") {
                    d.businessname = " ";
                }

                if (typeof d.fechadecontitucion === "undefined") {
                    d.fechadecontitucion = momentJs('1948-03-06').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                } else {
                    d.fechadecontitucion = momentJs(d.fechadecontitucion).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                }

                personAdd = {
                    "personaJuridica": {
                        "fechaConstitucion": d.fechadecontitucion,
                        "razonSocial": d.businessname
                    },
                }
            }

            if (typeof d.department_code !== "undefined" && d.department_code != null && d.department_code !== ' ') {
                if (d.department_code === 0) {
                    d.department_code = '11';
                }
            } else {
                d.department_code = '11';
            }
            if (typeof d.city_code !== "undefined" && d.city_code != null && d.city_code !== ' ') {
                if (d.city_code === 0) {
                    d.city_code = '1';
                }
            } else {
                d.city_code = '1';
            }
            if (!d.address_type || d.address_type === ' ') d.address_type = '1';
            let contactPerson = {
                "contacto": [
                    {
                        "tipoContacto": {
                            "codigo": typeof d.phone_type === "undefined" || d.phone_type === null || d.phone_type === ' ' ? '1' : d.phone_type.toString(),
                        },
                        "textoContacto": typeof d.telefono === "undefined" || d.telefono === null ? ' ' : d.telefono.toString(),
                    },
                    // Email
                    {
                        "tipoContacto": {
                            "codigo": 3,
                        },
                        "textoContacto": d.email,
                    },
                ]
            };
            if( d.role.indexOf(5) !== -1 || d.role.indexOf(6) !== -1){
                contactPerson = {}
            }

            arrayToMerge.push({
                "tipoDocumento": {
                    "codigo": typeof d.document_type === "undefined" || d.document_type === null ? '37' : d.document_type.toString(),
                },
                "numeroDocumento": typeof d.document === "undefined" || d.document === null ? ' ' : d.document.toString(),
                "tipoPersona": {
                    "codigo": d.tipoPersona.codigo.toString(),
                },
                ...personAdd,
                "direccion": {
                    "pais": {
                        "codigo": "170"
                    },
                    "departamento": {
                        "codigo": d.department_code,
                    },
                    "ciudad": {
                        "codigo": d.city_code,
                    },
                    "tipoDireccion": {
                        "codigo": d.address_type,
                    },
                    "textoDireccion": typeof d.address === "undefined" || d.address === null ? '' : d.address.toString(),
                },
                ...contactPerson
            })
        }
        return arrayToMerge;
    }

    /**
     * 
     * @param {import('./QuoteIussedById').QuoteIussed} data 
     */
    static async get(data) {
        let aseguradoArr = [];
        let beneficiarioArr = [];
        let tomadorArr = [];

        let taker = data.quote_iussed_info.Item.taker;
        if (typeof taker.role !== "undefined") {
            for (let i = 0; i < taker.role.length; i++) {
                if (taker.role[i] === 1) {
                    tomadorArr.push(taker);
                } else if (taker.role[i] === 2) {
                    aseguradoArr.push(taker);
                } else if (taker.role[i] === 3) {
                    beneficiarioArr.push(taker);
                }
            }
        }

        let benefist = data.quote_iussed_info.Item.benefist;
        for (let i = 0; i < benefist.length; i++) {
            if (typeof benefist[i].role !== "undefined") {
                for (let ii = 0; ii < benefist[i].role.length; ii++) {
                    if (benefist[i].role[ii] === 1) {
                        tomadorArr.push(benefist[i]);
                    } else if (benefist[i].role[ii] === 2) {
                        aseguradoArr.push(benefist[i]);
                    } else if (benefist[i].role[ii] === 3) {
                        beneficiarioArr.push(benefist[i]);
                    }
                }
            }
        }

        let insured = data.quote_iussed_info.Item.insured;
        for (let i = 0; i < insured.length; i++) {
            if (typeof insured[i].role !== "undefined") {
                for (let ii = 0; ii < insured[i].role.length; ii++) {
                    if (insured[i].role[ii] === 1) {
                        tomadorArr.push(insured[i]);
                    } else if (insured[i].role[ii] === 2) {
                        aseguradoArr.push(insured[i]);
                    } else if (insured[i].role[ii] === 3) {
                        beneficiarioArr.push(insured[i]);
                    }
                }
            }
        }

        /**
         * @type {import('./QuoteIussedById').PersonAditional[]}
         */
        let additional = [];
        let persons_aditionals = data.quote_iussed_info.Item.persons_aditionals;
        if (typeof persons_aditionals !== "undefined") additional = persons_aditionals;

        let onerous = [];
        let onerous_people = data.quote_iussed_info.Item.onerous;
        if( typeof onerous_people !== "undefined" ) onerous = onerous_people;

        let asegurado = Crearpolizaiaxis.formatPerson(aseguradoArr);
        let beneficiarios = Crearpolizaiaxis.formatPerson(beneficiarioArr);
        let additionals = Crearpolizaiaxis.formatPerson(additional);
        let onerosos = Crearpolizaiaxis.formatPerson(onerous);
        let tomador = Crearpolizaiaxis.formatPerson(tomadorArr)[0];

        for (let i = 0; i < beneficiarios.length; i++) {
            beneficiarios[i] = Crearpolizaiaxis.mapBeneficiary(beneficiarios[i])
        }

        const {
          exequiasParticipation,
          personalAccidents,
        } = fieldsParticipation;
        const codes = {
          [exequiasParticipation]: 774,
          [personalAccidents]: 716,
        };
        for (let i = 0; i < additionals.length; i++) {
          const additionalMap = additionals[i];
          const person = additional[i];
          let existsParticipation = false;
          Object.keys(codes).forEach((participationValue) => {
            if (isRoleParticipation(participationValue, person.role)) {
              existsParticipation = true;
              const porcentaje = String(person[participationValue]);
              const beneficiary = Crearpolizaiaxis.mapBeneficiary(
                additionalMap,
                {
                  garantiaBeneficiario: {
                    codigo: String(codes[participationValue]),
                    porcentaje,
                  },
                }
              );
              beneficiarios.push(beneficiary);
            }
          });
          if (!existsParticipation) {
            beneficiarios.push(additionalMap);
          }
        }

        for (let i = 0; i < onerosos.length; i++) {
            beneficiarios.push({
                "persona": onerosos[i],
                "tipoBeneficiario": {
                    "codigoTexto": "O"
                },
                "garantiaBeneficiario": {
                    "codigo": "0"
                }
            });
        }

        return {
            "asegurado": asegurado,
            "tomador": tomador,
            "beneficiario": beneficiarios,
        };
    };

    static mapBeneficiary(beneficiario, { garantiaBeneficiario } = {}) {
        return {
          persona: beneficiario,
          tipoBeneficiario: {
            codigoTexto: 'G',
          },
          garantiaBeneficiario: {
            codigo: '0',
            ...garantiaBeneficiario,
          },
        };
    }

    static async save(data) {
        let user = await ConsultaPersonas.getUser();
        let response = Api.post(BaseUrl, data, Url, undefined, {
            Authorization: user !== null ? "Bearer " + user['accessToken'] : ''
        }).catch((e) => {
            if (typeof e === 'object') {
                try {
                  const {
                    codigoEstado,
                    codigoEstadoServidor,
                    severidad,
                  } = e.response.crearPolizaIAXISRs.infoResponse.estado;
                  if (
                    codigoEstado === 2 &&
                    codigoEstadoServidor === -45 &&
                    severidad === 'ERROR'
                  )
                    return e.response;
                } catch (error) {}
            }
            throw e;
        });
        return response;
    }

}

export default Crearpolizaiaxis;
