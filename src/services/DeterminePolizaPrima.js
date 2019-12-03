import Api from './Api';
import ConsultaPersonas from './ConsultaPersonas';

const BaseUrl = "/prev-determine-poliza-prima/";

class DeterminePolizaPrima {
    static async get(data, id) {
        let user = await ConsultaPersonas.getUser();
        return await Api.post(BaseUrl + id, data, undefined, undefined, {
            pelhauthorization: user !== null ? user['accessToken'] : ''
        });
    };
}

export default DeterminePolizaPrima;
