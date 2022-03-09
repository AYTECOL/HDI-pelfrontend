import Api from './Api';
import Store from '../store';
import Masknumbermoney from '../common/helpers/masknumbermoney/Masknumbermoney';
import momentJs from 'moment';
import AuthHeader from './AuthHeader';
import MobileContents from '../components/cotizaciones/inmueble/forms/MobileContents';
import OtherQuestions from '../components/cotizaciones/inmueble/forms/OtherQuestions';
const BaseUrl = '/create-or-update-valoration/';

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
      build_material_index: risks.indexBuild,

      cojunto_cerrado: risks.cojuntocerrado,

      alarma: risks.seguridad.alarma === '' ? 0 : risks.seguridad.alarma,
      caja_fuerte:
        risks.seguridad.cajafuerte === '' ? 0 : risks.seguridad.cajafuerte,
      puertas_control_domotico:
        risks.seguridad.puertascontroldomotico === ''
          ? 0
          : risks.seguridad.puertascontroldomotico,
      puertas_seguridad_blindada:
        risks.seguridad.puertasseguridadblindada === ''
          ? 0
          : risks.seguridad.puertasseguridadblindada,
      circuito_cerrado_tv:
        risks.seguridad.circuitocerradotv === ''
          ? 0
          : risks.seguridad.circuitocerradotv,
      vigilancia_permanente:
        risks.seguridad.vigilanciapermanente === ''
          ? 0
          : risks.seguridad.vigilanciapermanente,
      regulador_de_voltaje:
        risks.seguridad.reguladordevoltaje === ''
          ? 0
          : risks.seguridad.reguladordevoltaje,

      inmueble_asegudado: risks.inmuebleasegudado,
      inmueble_asegudadovalor:
        parseInt(risks.inmuebleasegudado) === 0
          ? 0
          : Masknumbermoney.formatToNumber(risks.inmuebleasegudadovalor),

      contenido_asegudado: risks.contenidoasegudado,
      contenido_asegudado_valor:
        parseInt(risks.contenidoasegudado) === 0
          ? 0
          : Masknumbermoney.formatToNumber(risks.contenidoasegudadovalor),

      inmueble_asegudado_joyas: risks.inmuebleasegudadojoyas,
      inmueble_asegudado_joyasvalor:
        parseInt(risks.inmuebleasegudadojoyas) === 0
          ? 0
          : Masknumbermoney.formatToNumber(risks.inmuebleasegudadojoyasvalor),
      [MobileContents.nameModel]: risks[MobileContents.nameModel],
      [MobileContents.nameModelValue]:
        parseInt(risks[MobileContents.nameModelValue]) === 0
          ? 0
          : Masknumbermoney.formatToNumber(
              risks[MobileContents.nameModelValue]
            ),
      [OtherQuestions.nameModel]: risks[OtherQuestions.nameModel],
      [OtherQuestions.nameModelValue]: risks[OtherQuestions.nameModelValue],
      inmueble_asegudado_obras: risks.inmuebleasegudadoobras,
      inmueble_asegudado_obrasvalor:
        parseInt(risks.inmuebleasegudadoobras) === 0
          ? 0
          : Masknumbermoney.formatToNumber(risks.inmuebleasegudadoobrasvalor),

      inmueble_asegudado_telefonos: risks.inmuebleasegudadotelefonos,
      inmueble_asegudado_telefonosvalor:
        parseInt(risks.inmuebleasegudadotelefonos) === 0
          ? 0
          : Masknumbermoney.formatToNumber(
              risks.inmuebleasegudadotelefonosvalor
            ),

      inspection_policies:
        typeof risks.inspection_policies === 'undefined'
          ? 0
          : risks.inspection_policies,

      prospect: store.prospect.prospect,
      total_premium_policy: store.prospect.total_premium_policy,
      expedition_expenses: store.prospect.expedition_expenses,
      total_tax_policy: store.prospect.total_tax_policy,
      iva_expedition_expenses: store.prospect.iva_expedition_expenses,

      distribution_of_insured_securities_split: {
        runtimeContext: {
          currentDate: momentJs().toISOString(),
          requestDate: momentJs().toISOString(),
          lob: 'string',
          nature: 'string',
          usState: 'AL',
          country: 'AL',
          usRegion: 'MW',
          currency: 'ALL',
          lang: 'ALB',
          region: 'NCSA',
          caProvince: 'AB',
          caRegion: 'QC',
        },
        valorAmparo: {
          valorAsegurado3012: 100000000,
          valorAsegurado3019: 10000000,
          valorAsegurado3018: 1000000,
          valorAsegurado3027: 100000000,
          valorAsegurado3034: 10000000,
          valorAsegurado3033: 1000000,
          valorAsegurado3035: 100000000,
          valorAsegurado3041: 10000000,
          valorAsegurado3040: 1000000,
          valorAsegurado3016: 10000000,
          valorAsegurado3017: 1000000,
          valorAsegurado9688: 10000000,
          valorAsegurado9687: 1000000,
          valorAsegurado3038: 3000000,
          valorAsegurado3045: 2000000,
          valorAsegurado3044: 1500000,
        },
      },
    };
    for (let i in data) if (data[i] === '') data[i] = 0;
    // TODO intercept request
    let authHeader = new AuthHeader();
    authHeader = authHeader.generateAuthCode();
    return await Api.post(
      BaseUrl + nCotizacion,
      data,
      undefined,
      undefined,
      authHeader
    );
  }
}

export default CreateOrUpdateValoration;
