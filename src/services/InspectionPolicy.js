import Api from './Api';
import momentJs from 'moment';
import store from "../store";
import Masknumbermoney from "../common/helpers/masknumbermoney/Masknumbermoney";
import ConsultaPersonas from "./ConsultaPersonas";
import AuthHeader from './AuthHeader';
const BaseUrl = "/determine-inspection-policies";

class InspectionPolicy {
    static async get() {
        let user = await ConsultaPersonas.getUser();
        let Inmueble = store.getState().Inmueble;
        let dataToSend = {
            "runtimeContext": {
                "currentDate": momentJs().toISOString(),
                "requestDate": momentJs().toISOString(),
                "lob": "string" /*quemados*/,
                "nature": "string" /*quemados*/,
                "usState": "AL" /*quemados*/,
                "country": "AL" /*quemados*/,
                "usRegion": "MW" /*quemados*/,
                "currency": "ALL" /*quemados*/,
                "lang": "ALB" /*quemados*/,
                "region": "NCSA" /*quemados*/,
                "caProvince": "AB" /*quemados*/,
                "caRegion": "QC" /*quemados*/
            },
            "inspecciones": {
                "ciudad": 0 /*quemados*/,
                "departamento": 0 /*quemados*/,
                "tipoVivienda": parseInt(Inmueble.type_risk),
                "zonaVivienda": parseInt(Inmueble.zona),
                "conjuntoCerrado": parseInt(Inmueble.cojuntocerrado),
                "inmuebleUtilizado": 1 /*quemados*/,
                "anoConstruccionVivienda": typeof Inmueble.anoconstruido !== "undefined" ? parseInt(Inmueble.anoconstruido) : 0,
                "normasSismoresistentes": typeof Inmueble.refuerzo !== "undefined" ? parseInt(Inmueble.refuerzo) : 0,
                "anoRehabilitacionVivienda": typeof Inmueble.anorefuerzo !== "undefined" ? parseInt(Inmueble.refuerzo) === 1 ? parseInt(Inmueble.anorefuerzo) : 0 : 0,
                "tipoConstruccionVivienda": parseInt(Inmueble.construidocon),
                "actividadesRiesgo": 0 /*quemados*/,
                "numeroPisosRiesgo": parseInt(Inmueble.numerodepisos),
                "pisoRiesgo": parseInt(Inmueble.type_risk) === 1 ? 0 : parseInt(Inmueble.pisonumero),
                "sumaAseguradaInmueble": parseInt(Inmueble.inmuebleasegudado) === 1 ? Masknumbermoney.formatToNumber(Inmueble.inmuebleasegudadovalor) : 0,
                "sumaAseguradaContenido": parseInt(Inmueble.contenidoasegudado) === 1 ? Masknumbermoney.formatToNumber(Inmueble.contenidoasegudadovalor) : 0,
                "sumaAseguradaJoyas": parseInt(Inmueble.inmuebleasegudadojoyas) === 1 ? Masknumbermoney.formatToNumber(Inmueble.inmuebleasegudadojoyasvalor) : 0,
                "sumaAseguradaObrasArte": parseInt(Inmueble.inmuebleasegudadoobras) === 1 ? Masknumbermoney.formatToNumber(Inmueble.inmuebleasegudadoobrasvalor) : 0,

                "vigilanciaPermanente": Inmueble.seguridad.vigilanciapermanente === 1,
                "alarmaMonitoreada": Inmueble.seguridad.alarma === 1,
                "circuitoCerrado": Inmueble.seguridad.circuitocerradotv === 1,
                "puertaSeguridad": Inmueble.seguridad.puertasseguridadblindada === 1,
                "cajaFuerte": Inmueble.seguridad.cajafuerte === 1,
                "reguladorVoltaje": Inmueble.seguridad.reguladordevoltaje === 1,
                "puertasControl": Inmueble.seguridad.puertascontroldomotico === 1,
                "respuestaInspeccion": ""
            },
            "token":user["accessToken"]
        };
        // TODO intercept request
        let authHeader =  new AuthHeader()
        authHeader = authHeader.generateAuthCode()
        let response = await Api.post(BaseUrl, dataToSend, undefined, undefined, authHeader);
        if (typeof response.results === "undefined") {
            response = null;
        } else {
            if (typeof response.results[response.results.length - 1] === "undefined") {
                response = null;
            } else {
                response = response.results[response.results.length - 1];
                if (response[1] === 'IC') response[0] = "Inspección en campo";
                if (response[1] === 'RF') response[0] = "Registro fotográfico";
                if (response[1] === 'NA') response[0] = "No Aplica";
            }
        }
        return response;
    };
}

export default InspectionPolicy;
