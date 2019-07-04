import Api from './Api';
import Helpers from "../common/helpers/helpers/Helpers";

const BaseUrl = "/pdf-poliza-hogar/";

class PdfPolizaHogar {
    static async get(id) {
        let user = await Helpers.getUser();
        let data = await Api.get(BaseUrl + id, undefined, {
            pelhauthorization: user !== null ? user['accessToken'] : ''
        }, true);

        try{

        }catch(e){

        }

        return data;
    };
}

export default PdfPolizaHogar;
