import Api from './Api';
import Helpers from '../common/helpers/helpers';
/* import AccessToken from '../services/AccessToken'; */
import Store from '../store';
import AuthHeader from './AuthHeader';
import { STATUS } from 'assets/constants';
const Url = '/audit-register';

function getFormattedDate() {
  const date = new Date();
  date.setHours(date.getUTCHours() - 5); // Ajuste para UTC-5
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

class CreateAuditData {
  static async createDataAudit(data) {
    console.log('aqui');
    const { cotizacion, auth } = Store.getState();

    // TODO intercept request
    let authHeader = new AuthHeader();
    authHeader = authHeader.generateAuthCode();
    let body = {
      id: Date.now(),
      opcion: data.opcion ?? '',
      respuesta: data.respuesta ?? [],
      campo_filtro: data.campo_filtro ?? '',
      fecha_ejecucion: getFormattedDate(),
      clave_broker: data.clave_broker ?? auth.agente,
      username: data.username ?? auth.usuario,
      celular: data.celular ?? auth.Celular,
      nombreIntermediario: data.nombreIntermediario ?? auth.nombreUsuario,
      sucursal: data.sucursal ?? auth.Sucursal,
      identificacion: data.identificacion ?? '0',
      respuesta_identificacion: data.respuesta_identificacion ?? [],
      cotizacion: data.cotizacion,
      fecha_cotizacion: data.fecha_cotizacion ?? cotizacion.fecha_cotizacion,
      id_ciudad: data.id_ciudad,
      id_departamento: data.id_departamento,
      riesgo: data.riesgo,
      prima: data.prima,
      poliza: data.poliza,
    };
    return await Api.post(
      Url,
      {
        data: body,
      },
      undefined,
      undefined,
      authHeader
    );
  }
}

export default CreateAuditData;
