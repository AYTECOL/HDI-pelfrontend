import Api from './Api';
import ConsultaPersonas from './ConsultaPersonas';

const BaseUrl = "/pdf-poliza-hogar/";

let _index = 0;

class PdfPolizaHogar {
    static async get(id) {
        let user = await ConsultaPersonas.getUser();
        try {
            return await Api.get(BaseUrl + id, undefined, {
                pelhauthorization: user !== null ? user['accessToken'] : ''
            }, true);
        } catch (e) {
            if (_index < 3) {
                _index++;
                return await PdfPolizaHogar.get(id);
            } else {
                _index = 0;
            }
        }
    };
}

export default PdfPolizaHogar;
