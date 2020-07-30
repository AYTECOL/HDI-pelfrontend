import Api from './Api';
import ConsultaPersonas from './ConsultaPersonas';
import AuthHeader from './AuthHeader';
const BaseUrl = '/prev-pdf-poliza-prima/';

let _index = 0;
class PrevPdfPolizaPrima {
  static async get(plan, quoteId) {
    const user = await ConsultaPersonas.getUser();
    /**
     * @type {{ nombreUsuario: string | undefined }}
     */
    const intermediary = { nombreUsuario: user.nombreUsuario };
    try {
      let authHeader = new AuthHeader();
      authHeader = authHeader.generateAuthCode();
      authHeader['pelhauthorization'] =
        user !== null ? user['accessToken'] : '';
      return Api.post(
        BaseUrl + quoteId,
        { ...plan, intermediary },
        undefined,
        undefined,
        authHeader,
        true
      );
    } catch (e) {
      if (_index < 3) {
        _index++;
        return PrevPdfPolizaPrima.get(plan, quoteId);
      } else {
        _index = 0;
      }
    }
  }
}

export default PrevPdfPolizaPrima;
