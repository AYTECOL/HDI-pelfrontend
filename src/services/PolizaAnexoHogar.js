import Api from './Api';
import ConsultaPersonas from './ConsultaPersonas';
import AuthHeader from './AuthHeader';
const BaseUrl = "/poliza-anexo-hogar/";

let _index = 0;

class PolizaAnexoHogar {
    static async get(id) {
        let user = await ConsultaPersonas.getUser();
        try {
            let authHeader =  new AuthHeader();
            authHeader = authHeader.generateAuthCode();
            authHeader['pelhauthorization'] = user !== null ? user['accessToken'] : '';
            return await Api.get(BaseUrl + id, undefined, authHeader, true);
        } catch (e) {
            if (_index < 3) {
                _index++;
                return await PolizaAnexoHogar.get(id);
            } else {
                _index = 0;
            }
        }
    };
}

export default PolizaAnexoHogar;
