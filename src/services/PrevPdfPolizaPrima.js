import Api from './Api';
import Helpers from "../common/helpers/helpers/Helpers";

const BaseUrl = "/prev-pdf-poliza-prima/";

class PrevPdfPolizaPrima {
    static async get(id) {
        let user = await Helpers.getUser();
        return await Api.get(BaseUrl + id, undefined, {
            pelhauthorization: user !== null ? user['accessToken'] : ''
        });
    };
}

export default PrevPdfPolizaPrima;
