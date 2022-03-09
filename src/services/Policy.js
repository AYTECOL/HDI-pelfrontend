import Api from './Api';
import ConsultaPersonas from './ConsultaPersonas';
import AuthHeader from './AuthHeader';
const Url = '/emit-policy';

class Policy {
  static async emit(quoteId, data) {
    let user = await ConsultaPersonas.getUser();
    let authHeader = new AuthHeader();
    authHeader = authHeader.generateAuthCode();
    authHeader['pelhauthorization'] = user !== null ? user['accessToken'] : '';
    return await Api.post(Url, data, undefined, undefined, authHeader);
  }
}

export default Policy;
