import Api from './Api';
import momentJs from 'moment';
import Helpers from "../common/helpers/helpers/Helpers";

const BaseUrl = "/crearpolizaiaxis";
const Url = "https://fay88y18qk.execute-api.us-east-1.amazonaws.com/dev";

class Crearpolizaiaxis {

    static formatPerson(person) {
        let arrayToMerge = [];
        for (var i = 0; i < person.length; i++) {
            let d = person[i];

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
                if( typeof d.document_type === "undefined" || d.document_type === null ){
                    d.tipoPersona = {
                        "codigo": 1
                    }
                }else{
                    if( d.document_type.toString() === "36" ){
                        d.tipoPersona = {
                            "codigo": 1
                        }
                    }else if( d.document_type.toString() === "37" ){
                        d.tipoPersona = {
                            "codigo": 2
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
                if (typeof d.birthdate === "undefined") {
                    d.fechadenacimiento = '1948-03-06';
                } else {
                    d.fechadenacimiento = d.birthdate;
                }
            }

            arrayToMerge.push({
                "tipoDocumento": {
                    "codigo": typeof d.document_type === "undefined" || d.document_type === null ? ' ' : d.document_type.toString(),
                },
                "numeroDocumento": typeof d.document === "undefined" || d.document === null ? ' ' : d.document.toString(),
                "tipoPersona": {
                    "codigo": d.tipoPersona.codigo.toString(),
                },
                "personaNatural": {
                    "primerApellido": typeof d.lastname === "undefined" || d.lastname === null ? ' ' : d.lastname,
                    "primerNombre": typeof d.first_name === "undefined" || d.first_name === null ? ' ' : d.first_name,
                    "segundoApellido": typeof d.secondlastname === "undefined" || d.secondlastname === null ? ' ' : d.secondlastname,
                    "segundoNombre": typeof d.secondname === "undefined" || d.secondname === null ? ' ' : d.secondname,
                    "genero": {
                        "codigo": typeof d.secondname === "undefined" || d.genero === null ? '1' : d.genero.toString(),
                    },
                    "fechaNacimiento": momentJs.utc(d.fechadenacimiento) === null ? '' : momentJs.utc(d.fechadenacimiento),
                    "estadoCivil": {
                        "codigo": typeof d.personaNatural.estadoCivil.codigo === "undefined" || d.personaNatural.estadoCivil.codigo === null ? '1' : d.personaNatural.estadoCivil.codigo.toString(),
                    },
                    "ocupacion": {
                        "codigo": typeof d.personaNatural.ocupacion.codigo === "undefined" || d.personaNatural.ocupacion.codigo === null ? '1' : d.personaNatural.ocupacion.codigo.toString(),
                    }
                },
                "direccion": {
                    "pais": {
                        "codigo": "170"
                    },
                    "departamento": {
                        "codigo": typeof d.department_code === "undefined" || d.department_code === null ? '1' : d.department_code.toString(),
                    },
                    "ciudad": {
                        "codigo": typeof d.city_code === "undefined" || d.city_code === null ? '1' : d.city_code.toString(),
                    },
                    "tipoDireccion": {
                        "codigo": typeof d.adresstype === "undefined" || d.adresstype === null ? '1' : d.adresstype.toString(),
                    },
                    "textoDireccion": typeof d.address === "undefined" || d.address === null ? '' : d.address.toString(),
                },
                "contacto": [
                    {
                        "tipoContacto": {
                            "codigo": typeof d.phone_type === "undefined" || d.phone_type === null ? '1' : d.phone_type.toString(),
                        },
                        "textoContacto": typeof d.telefono === "undefined" || d.telefono === null ? ' ' : d.telefono.toString(),
                    },
                ]
            })
        }
        return arrayToMerge;
    }

    static async get(data) {
        let asegurado = Crearpolizaiaxis.formatPerson(data.quote_iussed_info.Item.insured);
        let beneficiario = Crearpolizaiaxis.formatPerson(data.quote_iussed_info.Item.benefist);
        let onerosos = Crearpolizaiaxis.formatPerson(data.quote_iussed_info.Item.onerous);
        let tomador = Crearpolizaiaxis.formatPerson([data.quote_iussed_info.Item.taker])[0];

        for (let i = 0; i < beneficiario.length; i++) {
            beneficiario[i] = {
                "persona": beneficiario[i],
                "tipoBeneficiario": {
                    "codigoTexto": "G"
                },
                "garantiaBeneficiario": {
                    "codigo": "0"
                }
            }
        }

        for (let i = 0; i < onerosos.length; i++) {
            beneficiario.push({
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
            "beneficiario": beneficiario,
        };
    };

    static async save(data){
        let user = await Helpers.getUser();
        let response = await Api.post(BaseUrl, data, Url, undefined, {
            Authorization: user !== null ? "Bearer " + user['accessToken'] : ''
        });
        console.log(response);
        return response;
    }

}

export default Crearpolizaiaxis;
