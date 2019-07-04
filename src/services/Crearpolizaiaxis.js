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
                if (typeof d.document_type === "undefined" || d.document_type === null) {
                    d.tipoPersona = {
                        "codigo": 1
                    }
                } else {
                    if (d.document_type.toString() === "36") {
                        d.tipoPersona = {
                            "codigo": 1
                        }
                    } else if (d.document_type.toString() === "37") {
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
                if (typeof d.birthdate !== "undefined") {
                    d.fechadenacimiento = d.birthdate;
                }else{
                    d.fechadenacimiento = '1948-03-06';
                }
            }
            if( d.fechadenacimiento.trim() === "" || d.fechadenacimiento === null) d.fechadenacimiento = '1948-03-06';
            d.fechadenacimiento = momentJs(d.fechadenacimiento).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

            arrayToMerge.push({
                "tipoDocumento": {
                    "codigo": typeof d.document_type === "undefined" || d.document_type === null ? '37' : d.document_type.toString(),
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
                        "codigo": typeof d.secondname === "undefined" || d.genero === null || d.genero === ' ' ? '1' : d.genero.toString(),
                    },
                    "fechaNacimiento": d.fechadenacimiento,
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
                        "codigo": typeof d.department_code === "undefined" || d.department_code === null || d.department_code === ' ' ? '1' : d.department_code.toString(),
                    },
                    "ciudad": {
                        "codigo": typeof d.city_code === "undefined" || d.city_code === null || d.city_code === ' ' ? '1' : d.city_code.toString(),
                    },
                    "tipoDireccion": {
                        "codigo": typeof d.adresstype === "undefined" || d.adresstype === null || d.adresstype === ' ' ? '1' : d.adresstype.toString(),
                    },
                    "textoDireccion": typeof d.address === "undefined" || d.address === null ? '' : d.address.toString(),
                },
                "contacto": [
                    {
                        "tipoContacto": {
                            "codigo": typeof d.phone_type === "undefined" || d.phone_type === null || d.phone_type === ' ' ? '1' : d.phone_type.toString(),
                        },
                        "textoContacto": typeof d.telefono === "undefined" || d.telefono === null ? ' ' : d.telefono.toString(),
                    },
                ]
            })
        }
        return arrayToMerge;
    }

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
                        tomadorArr.push(benefist[ii]);
                    } else if (benefist[i].role[ii] === 2) {
                        aseguradoArr.push(benefist[ii]);
                    } else if (benefist[i].role[ii] === 3) {
                        beneficiarioArr.push(benefist[ii]);
                    }
                }
            }
        }

        let insured = data.quote_iussed_info.Item.insured;
        for (let i = 0; i < insured.length; i++) {
            if (typeof insured[i].role !== "undefined") {
                for (let ii = 0; ii < insured[i].role.length; ii++) {
                    if (insured[i].role[ii] === 1) {
                        tomadorArr.push(insured[ii]);
                    } else if (insured[i].role[ii] === 2) {
                        aseguradoArr.push(insured[ii]);
                    } else if (insured[i].role[ii] === 3) {
                        beneficiarioArr.push(insured[ii]);
                    }
                }
            }
        }

        let asegurado = Crearpolizaiaxis.formatPerson(aseguradoArr);
        let beneficiario = Crearpolizaiaxis.formatPerson(beneficiarioArr);
        let onerosos = Crearpolizaiaxis.formatPerson(data.quote_iussed_info.Item.onerous);
        let tomador = Crearpolizaiaxis.formatPerson(tomadorArr)[0];

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

    static async save(data) {
        let user = await Helpers.getUser();
        let response = await Api.post(BaseUrl, data, Url, undefined, {
            Authorization: user !== null ? "Bearer " + user['accessToken'] : ''
        });
        return response;
    }

}

export default Crearpolizaiaxis;
