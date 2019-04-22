import Service from './Service';

const BaseUrl = "/";

class RiskData {
    static async get(id) {
        let url = BaseUrl + "valoration-by-id/" + id;
        let data = await Service.get(url);
        if (typeof data.valoration.Item !== "undefined") {
            let item = data.valoration.Item;
            return {
                type_risk: item.risk_type,
                type_risk_id: item.risk_type,
                numerodepisos: item.floors_number,
                pisonumero: item.location_floor,
                zona: item.location_zone,
                anoconstruido: item.build_year,
                refuerzo: item.structure_reinforcement,
                anorefuerzo: item.reinforcement_year,
                construidocon: item.build_material,
                cojuntocerrado: item.cojunto_cerrado,
                seguridad: {
                    alarma: item.seguridad.alarma,
                    cajafuerte: item.seguridad.caja_fuerte,
                    puertascontroldomotico: item.seguridad.puertas_control_domotico,
                    puertasseguridadblindada: item.seguridad.puertas_seguridad_blindada,
                    circuitocerradotv: item.seguridad.circuito_cerrado_tv,
                    vigilanciapermanente: item.seguridad.vigilancia_permanente,
                    reguladordevoltaje: item.seguridad.regulador_de_voltaje,
                },
                inmuebleasegudado: item.inmueble_asegudado,
                inmuebleasegudadovalor: item.inmueble_asegudadovalor,
                contenidoasegudado: item.contenido_asegudado,
                contenidoasegudadovalor: item.contenido_asegudado_valor,
                inmuebleasegudadojoyas: item.inmueble_asegudado_joyas,
                inmuebleasegudadojoyasvalor: item.inmueble_asegudado_joyasvalor,
                inmuebleasegudadoobras: item.inmueble_asegudado_obras,
                inmuebleasegudadoobrasvalor: item.inmueble_asegudado_obrasvalor,
                inmuebleasegudadotelefonos: item.inmueble_asegudado_telefonos,
                inmuebleasegudadotelefonosvalor: item.inmueble_asegudado_telefonosvalor
            };
        } else {
            return null;
        }
    };
}

export default RiskData;
