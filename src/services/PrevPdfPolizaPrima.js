import Api from "./Api";
import ConsultaPersonas from "./ConsultaPersonas";
import AuthHeader from './AuthHeader';
const BaseUrl = "/prev-pdf-poliza-prima/";

let _index = 0;

class PrevPdfPolizaPrima {
    static async get(plan, quoteId) {
        let user = await ConsultaPersonas.getUser();
        try {
            let authHeader =  new AuthHeader();
            authHeader = authHeader.generateAuthCode();
            authHeader['pelhauthorization'] = user !== null ? user['accessToken'] : '';
            return await Api.post(BaseUrl + quoteId, plan, undefined, undefined, authHeader, true);
        } catch (e) {
            if (_index < 3) {
                _index++;
                return await PrevPdfPolizaPrima.get(plan, quoteId);
            } else {
                _index = 0;
            }
        }
    }
}

export default PrevPdfPolizaPrima;
