import Service from './Api';
import Helpers from "../common/helpers/helpers/Helpers";

const UrlServicePerson = "https://fay88y18qk.execute-api.us-east-1.amazonaws.com/dev/";
const Baseurl = "consultarpersona";

/*const Default = {
    "consultarPersonaRs": {
        "infoResponse": {
            "estado": {
                "codigoEstado": 0,
                "codigoEstadoServidor": 0,
                "descripcionEstado": "OK",
                "severidad": "INFO"
            },
            "requestID": 456234
        },
        "personaEncontradaIAXIS": true,
        "personaRestringida": false,
        "scoreEncontradoIAXIS": false,
        "persona": {
            "codigoPersona": 456252,
            "tipoDocumento": {
                "codigo": 36,
                "nombre": "Cédula Ciudadanía"
            },
            "numeroDocumento": 7211726,
            "tipoPersona": {
                "codigo": 1,
                "nombre": "Natural"
            },
            "personaNatural": {
                "primerApellido": "BECERRA",
                "primerNombre": "ORLANDO",
                "segundoApellido": "BARRERA",
                "segundoNombre": null,
                "genero": {
                    "codigo": 1,
                    "nombre": "Hombre"
                },
                "fechaNacimiento": "1953-04-06T00:00:00.000-05:00",
                "estadoCivil": {
                    "codigo": null,
                    "nombre": null
                },
                "ocupacion": {
                    "codigo": 920,
                    "nombre": "Comerciante Tiendas de Servicio"
                }
            },
            "direccion": [
                {
                    "idDireccion": 1,
                    "pais": {
                        "codigo": 170,
                        "nombre": "COLOMBIA"
                    },
                    "departamento": {
                        "codigo": 15,
                        "nombre": "Boyacá"
                    },
                    "ciudad": {
                        "codigo": 238,
                        "nombre": "DUITAMA"
                    },
                    "tipoDireccion": {
                        "codigo": 9,
                        "nombre": "Residencia"
                    },
                    "textoDireccion": "CR 18 N 20 - 10 "
                },
                {
                    "idDireccion": 2,
                    "pais": {
                        "codigo": 170,
                        "nombre": "COLOMBIA"
                    },
                    "departamento": {
                        "codigo": 15,
                        "nombre": "Boyacá"
                    },
                    "ciudad": {
                        "codigo": 238,
                        "nombre": "DUITAMA"
                    },
                    "tipoDireccion": {
                        "codigo": 9,
                        "nombre": "Residencia"
                    },
                    "textoDireccion": "KR/ 18  20 10"
                }
            ],
            "contacto": [
                {
                    "tipoContacto": {
                        "codigo": 1,
                        "nombre": "Teléfono"
                    },
                    "idContacto": 1,
                    "textoContacto": 7602511
                },
                {
                    "tipoContacto": {
                        "codigo": 3,
                        "nombre": "E-mail"
                    },
                    "idContacto": 3,
                    "textoContacto": "456252ESTACIONDELAVADO@HOTMAIL.COM"
                },
                {
                    "tipoContacto": {
                        "codigo": 6,
                        "nombre": "Tfno. móvil"
                    },
                    "idContacto": 2,
                    "textoContacto": 3112312350
                }
            ]
        },
        "informacionSARLAFT": {
            "vigente": false
        }
    }
};*/

class Consultapersonas {
    static async get(type, value) {
        let data = {
            "consultarPersonaRq": {
                "infoRequest": {
                    "requestID": "456234",
                    "fecha": "2017-02-17T00:00:00.000-05:00",
                    "aplicacionCliente": "fefa",
                    "terminal": "1",
                    "ip": "1.1.1.1"
                },
                "tipoDocumento": {"codigo": type},
                "numeroDocumento": value,
                "consultarCreditScore": true,
                "consultarAniosExperiencia": false
            }
        };

        //return Default;

        let token = await Helpers.getUser();
        token = token === null ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudGUiOiI0MDkwODMzIiwiYXBwIjoiQ09UV0VCIiwibm9tYnJlVXN1YXJpbyI6IiwgQVNFU09SSUFTIEVOIFNFR1VST1MgVVJJQkUgTE9QRVogWSBDSUEuIExUREEuIChDb2xvbWJpYSkiLCJwZXJmaWwiOiJURF9DT1RXRUIiLCJzdGljayI6IjIwMTkuMDUuMzEgMTEuNTMuMjcuNjE2IiwidXN1YXJpbyI6ImNjMTIzNDU1MDAiLCJjbGllbnRfaWQiOiJvSTVWa1Z6anpFUzQ3ODZYd0VoVkRBZHlOM0FwaWFUTSIsImNsaWVudF9zZWNyZXQiOiJNTmhySkdQNmNHNDE5Nkd0IiwiaWF0IjoxNTU5MzIxNjU1LCJleHAiOjE1NTk0MDgwNTV9.jUkQ0Hj3QlLBPzB0AIY03G1CUwjqEsTK46VzHsPU1qk' : token.accessToken;
        return await Service.post(Baseurl, data, UrlServicePerson, undefined, {
            "Authorization": "Bearer " + token
        });
    };
}

export default Consultapersonas;