import Api from './Api';
import Helpers from "../common/helpers/helpers/Helpers";

const BaseUrl = "/poliza-anexo-hogar/";

let _index = 0;

class PolizaAnexoHogar {
    static async get(id) {
        let user = await Helpers.getUser();
        try {
            return await Api.get(BaseUrl + id, undefined, {
                pelhauthorization: user !== null ? user['accessToken'] : ''
            }, true);
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
