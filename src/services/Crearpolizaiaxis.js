import Api from './Api';
import momentJs from 'moment';
import store from "../store";
import Helpers from "../common/helpers/helpers/Helpers";

const BaseUrl = "/crearpolizaiaxis";
const Url = "https://fay88y18qk.execute-api.us-east-1.amazonaws.com/dev";

class Crearpolizaiaxis {


    static formatPerson(person) {
        let arrayToMerge = [];
        console.log(person);
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
                d.tipoPersona = {
                    "codigo": 0
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
                    d.fechadenacimiento = ' ';
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
                    "fechaNacimiento": momentJs.utc(d.fechadenacimiento),
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
        let storeState = store.getState();
        let user = await Helpers.getUser();

        console.log(data.quote_iussed_info.Item);

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

        let dataToSend = {
            "crearPolizaIAXISRq": {
                "infoRequest": {
                    "requestID": "BJSbGQOgQ",
                    "fecha": momentJs().toISOString(),
                    "aplicacionCliente": "QwuER29rtisj344M9enfjsFjkro3Lcnf4lrotiK853hdseRt",
                    "terminal": "149",
                    "ip": "172.17.0.2"
                },
                "poliza": {
                    "producto": {
                        "codigo": 900758
                    },
                    "datosPolizaHome": {
                        "riesgoHome": {
                            "ubicacionRiesgo": {
                                "textoDeVia": storeState.cotizacion.identification.address,
                                "departamento": parseInt(storeState.cotizacion.identification.department),
                                "ciudad": parseInt(storeState.cotizacion.identification.city)
                            }
                        },
                        "asegurado": asegurado,
                        "tomador": tomador,
                        "beneficiario": beneficiario,
                        "datosGestion": {
                            "numeroPoliza": 7009122 + parseInt(storeState.cotizacion.number),
                            "numeroRecibo": 9909121 + parseInt(storeState.cotizacion.number),
                            "agente": {
                                "codigo": user.agente.toString()
                            },
                            "duracion": {
                                "codigo": "12"
                            },
                            "fechaInicioVigencia": momentJs().toISOString(),
                            "gestionPago": {
                                "formaPago": {
                                    "codigo": "1"
                                },
                                "medioPago": {
                                    "codigoTexto": "E"
                                }
                            },
                            "datosPrima": {
                                "primaTotal": data.risk_valoration_info.Item.prospect.toString(),
                                "tipoComision": {
                                    "codigo": "1"
                                },
                                "comision": data.risk_valoration_info.Item.total_tax_policy.toString()
                            }
                        },
                        "garantia": [
                            {
                                "codigoAmparo": {
                                    "codigo": "755"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "1000000000",
                                "valorPrima": "83869",
                                "preguntaAmparo": {
                                    "pregunta": {
                                        "codigo": "1"
                                    },
                                    "respuesta": {
                                        "valor": "?"
                                    }
                                },
                                "preguntaTablaAmparo": [
                                    {
                                        "fila": "1",
                                        "columna": "1",
                                        "pregunta": {
                                            "codigo": "12"
                                        },
                                        "respuesta": {
                                            "valor": "rt1"
                                        }
                                    },
                                    {
                                        "fila": "1",
                                        "columna": "2",
                                        "pregunta": {
                                            "codigo": "12"
                                        },
                                        "respuesta": {
                                            "valor": "resp1"
                                        }
                                    }
                                ]
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "756"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "1000000000",
                                "valorPrima": "35687"
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "757"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "2000000000",
                                "valorPrima": "15295"
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "758"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "38500000",
                                "valorPrima": "81694"
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "759"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "38500000",
                                "valorPrima": "120670"
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "760"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "38500000",
                                "valorPrima": "553225"
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "761"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "38500000",
                                "valorPrima": "8149"
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "762"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "38500000",
                                "valorPrima": "27454"
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "763"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "1",
                                "valorPrima": "0"
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "764"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "1200000",
                                "valorPrima": "6531"
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "765"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "1200000",
                                "valorPrima": "15388"
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "766"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "13385074",
                                "valorPrima": "41696"
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "767"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "6770660",
                                "valorPrima": "23943"
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "768"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "1",
                                "valorPrima": "161210"
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "770"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "40000000",
                                "valorPrima": "13375"
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "771"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "44000000",
                                "valorPrima": "50116"
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "773"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "1",
                                "valorPrima": "11789"
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "774"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "1",
                                "valorPrima": "5974"
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "775"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "1",
                                "valorPrima": "5662"
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "776"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "1",
                                "valorPrima": "55178"
                            },
                            {
                                "codigoAmparo": {
                                    "codigo": "778"
                                },
                                "fechaInicioEfectoGarantia": "2018-06-16T05:00:00.000Z",
                                "capitalGarantia": "38500000",
                                "valorPrima": "43595"
                            }
                        ],
                        "deducible": [
                            {
                                "garantia": {
                                    "codigo": "755"
                                },
                                "tipoDeducible": {
                                    "codigo": "2"
                                },
                                "fechaInicio": "2018-06-16T05:00:00.000Z",
                                "tipoValor": {
                                    "codigo": "1"
                                },
                                "valor": "0",
                                "tipoValorMinimo": {
                                    "codigo": "4"
                                },
                                "valorMinimo": "0"
                            },
                            {
                                "garantia": {
                                    "codigo": "758"
                                },
                                "tipoDeducible": {
                                    "codigo": "2"
                                },
                                "fechaInicio": "2018-06-16T05:00:00.000Z",
                                "tipoValor": {
                                    "codigo": "1"
                                },
                                "valor": "0",
                                "tipoValorMinimo": {
                                    "codigo": "4"
                                },
                                "valorMinimo": "0"
                            },
                            {
                                "garantia": {
                                    "codigo": "759"
                                },
                                "tipoDeducible": {
                                    "codigo": "2"
                                },
                                "fechaInicio": "2018-06-16T05:00:00.000Z",
                                "tipoValor": {
                                    "codigo": "1"
                                },
                                "valor": "0",
                                "tipoValorMinimo": {
                                    "codigo": "4"
                                },
                                "valorMinimo": "0"
                            },
                            {
                                "garantia": {
                                    "codigo": "760"
                                },
                                "tipoDeducible": {
                                    "codigo": "2"
                                },
                                "fechaInicio": "2018-06-16T05:00:00.000Z",
                                "tipoValor": {
                                    "codigo": "1"
                                },
                                "valor": "10",
                                "tipoValorMinimo": {
                                    "codigo": "4"
                                },
                                "valorMinimo": "1"
                            },
                            {
                                "garantia": {
                                    "codigo": "761"
                                },
                                "tipoDeducible": {
                                    "codigo": "2"
                                },
                                "fechaInicio": "2018-06-16T05:00:00.000Z",
                                "tipoValor": {
                                    "codigo": "1"
                                },
                                "valor": "10",
                                "tipoValorMinimo": {
                                    "codigo": "4"
                                },
                                "valorMinimo": "1"
                            },
                            {
                                "garantia": {
                                    "codigo": "762"
                                },
                                "tipoDeducible": {
                                    "codigo": "2"
                                },
                                "fechaInicio": "2018-06-16T05:00:00.000Z",
                                "tipoValor": {
                                    "codigo": "1"
                                },
                                "valor": "10",
                                "tipoValorMinimo": {
                                    "codigo": "4"
                                },
                                "valorMinimo": "1"
                            },
                            {
                                "garantia": {
                                    "codigo": "771"
                                },
                                "tipoDeducible": {
                                    "codigo": "2"
                                },
                                "fechaInicio": "2018-06-16T05:00:00.000Z",
                                "tipoValor": {
                                    "codigo": "1"
                                },
                                "valor": "10",
                                "tipoValorMinimo": {
                                    "codigo": "4"
                                },
                                "valorMinimo": "1"
                            }
                        ],
                        "preguntaPoliza": [
                            {
                                "pregunta": {
                                    "codigo": "9959"
                                },
                                "respuesta": {
                                    "valor": "USER.UNQORK"
                                }
                            },
                            {
                                "pregunta": {
                                    "codigo": "4010",
                                    "nombre": ""
                                },
                                "respuesta": {
                                    "codigo": "1"
                                }
                            },
                            {
                                "pregunta": {
                                    "codigo": "4926"
                                },
                                "respuesta": {
                                    "codigo": "0",
                                    "valor": ""
                                }
                            },
                            {
                                "pregunta": {
                                    "codigo": "9008"
                                },
                                "respuesta": {
                                    "codigo": "1",
                                    "valor": ""
                                }
                            },
                            {
                                "pregunta": {
                                    "codigo": "4928"
                                },
                                "respuesta": {
                                    "codigo": "0",
                                    "valor": ""
                                }
                            },
                            {
                                "pregunta": {
                                    "codigo": "9006"
                                },
                                "respuesta": {
                                    "codigo": "1",
                                    "valor": ""
                                }
                            },
                            {
                                "pregunta": {
                                    "codigo": "4093"
                                },
                                "respuesta": {
                                    "codigo": "2",
                                    "valor": ""
                                }
                            },
                            {
                                "pregunta": {
                                    "codigo": "4907"
                                },
                                "respuesta": {
                                    "codigo": "0",
                                    "valor": ""
                                }
                            },
                            {
                                "pregunta": {
                                    "codigo": "4925"
                                },
                                "respuesta": {
                                    "codigo": "0",
                                    "valor": ""
                                }
                            }
                        ],
                        "preguntaTablaRiesgo": [
                            {
                                "fila": "1",
                                "columna": "1",
                                "pregunta": {
                                    "codigo": "123"
                                },
                                "respuesta": {
                                    "valor": "respTR1"
                                }
                            },
                            {
                                "fila": "1",
                                "columna": "2",
                                "pregunta": {
                                    "codigo": "123"
                                },
                                "respuesta": {
                                    "valor": "respTR2"
                                }
                            }
                        ]
                    }
                }
            }
        };

        let response = await Api.post(BaseUrl, dataToSend, Url, undefined, {
            pelhauthorization: user !== null ? user['accessToken'] : '',
            Authorization: user !== null ? "Bearer " + user['accessToken'] : ''
        });
        console.log(response);
        return response;
    };
}

export default Crearpolizaiaxis;
