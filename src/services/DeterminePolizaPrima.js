import Api from './Api';
import ConsultaPersonas from './ConsultaPersonas';
import AuthHeader from './AuthHeader';
const BaseUrl = "/prev-determine-poliza-prima/";

class DeterminePolizaPrima {
    static async get(data, id) {
        let user = await ConsultaPersonas.getUser();
        let authHeader =  new AuthHeader()
        authHeader = authHeader.generateAuthCode()
        authHeader['pelhauthorization'] = user !== null ? user['accessToken'] : ''
        return await Api.post(BaseUrl + id, data, undefined, undefined, authHeader);
    };
}

export default DeterminePolizaPrima;
