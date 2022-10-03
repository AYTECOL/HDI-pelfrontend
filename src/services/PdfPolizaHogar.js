import Api from './Api';
import ConsultaPersonas from './ConsultaPersonas';
import AuthHeader from './AuthHeader';
const BaseUrl = '/pdf-poliza-hogar/';

let _index = 0;

class PdfPolizaHogar {
  static async get(id) {
    let user = await ConsultaPersonas.getUser();
    const name = user.nombreUsuario.trim();
    try {
      let authHeader = new AuthHeader();
      authHeader = authHeader.generateAuthCode();
      authHeader['pelhauthorization'] =
        user !== null ? user['accessToken'] : '';
      return await Api.get(
        `${BaseUrl}${id}?name=${name}`,
        undefined,
        authHeader,
        true
      );
    } catch (e) {
      if (_index < 3) {
        _index++;
        return await PdfPolizaHogar.get(id);
      } else {
        _index = 0;
      }
    }
  }
}

export default PdfPolizaHogar;
