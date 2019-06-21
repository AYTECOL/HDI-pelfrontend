import Api from './Api';
import Helpers from "../common/helpers/helpers/Helpers";

const BaseUrl = "/poliza-anexo-hogar/";

class PolizaAnexoHogar {
    static async get(id) {
        let user = await Helpers.getUser();
        return await Api.get(BaseUrl + id, undefined, {
            pelhauthorization: user !== null ? user['accessToken'] : ''
        }, true);
    };
}

export default PolizaAnexoHogar;
