import Api from './Api';
import Store from '../store';
import Masknumbermoney from "../common/helpers/masknumbermoney/Masknumbermoney";

const BaseUrl = "/create-or-update-valoration/";

class CreateOrUpdateValoration {
    static async save() {
        let store = Store.getState();
        let nCotizacion = store.cotizacion.number;
        let risks = store.Inmueble;
        let data = {
            risk_type: risks.type_risk_id,
            risks_id: risks.type_risk_id,
            floors_number: risks.numerodepisos,
            location_floor: risks.pisonumero,
            location_zone: risks.zona,
            build_year: risks.anoconstruido,
            structure_reinforcement: risks.refuerzo,
            reinforcement_year: risks.anorefuerzo,
            build_material: risks.construidocon,
            cojunto_cerrado: risks.cojuntocerrado,

            alarma: risks.seguridad.alarma,
            caja_fuerte: risks.seguridad.cajafuerte,
            puertas_control_domotico: risks.seguridad.puertascontroldomotico,
            puertas_seguridad_blindada: risks.seguridad.puertasseguridadblindada,
            circuito_cerrado_tv: risks.seguridad.circuitocerradotv,
            vigilancia_permanente: risks.seguridad.vigilanciapermanente,
            regulador_de_voltaje: risks.seguridad.reguladordevoltaje,

            inmueble_asegudado: risks.inmuebleasegudado,
            inmueble_asegudadovalor: parseInt(risks.inmuebleasegudado) === 0 ? 0 : Masknumbermoney.formatToNumber(risks.inmuebleasegudadovalor),

            contenido_asegudado: risks.contenidoasegudado,
            contenido_asegudado_valor: parseInt(risks.contenidoasegudado) === 0 ? 0 : Masknumbermoney.formatToNumber(risks.contenidoasegudadovalor),

            inmueble_asegudado_joyas: risks.inmuebleasegudadojoyas,
            inmueble_asegudado_joyasvalor: parseInt(risks.inmuebleasegudadojoyas) === 0 ? 0 : Masknumbermoney.formatToNumber(risks.inmuebleasegudadojoyasvalor),

            inmueble_asegudado_obras: risks.inmuebleasegudadoobras,
            inmueble_asegudado_obrasvalor: parseInt(risks.inmuebleasegudadoobras) === 0 ? 0 : Masknumbermoney.formatToNumber(risks.inmuebleasegudadoobrasvalor),

            inmueble_asegudado_telefonos: risks.inmuebleasegudadotelefonos,
            inmueble_asegudado_telefonosvalor: parseInt(risks.inmuebleasegudadotelefonos) === 0 ? 0 : Masknumbermoney.formatToNumber(risks.inmuebleasegudadotelefonosvalor),
        };
        for (let i in data) if (data[i] === "") data[i] = 0;
        return await Api.post(BaseUrl + nCotizacion, data);
    };
}

export default CreateOrUpdateValoration;