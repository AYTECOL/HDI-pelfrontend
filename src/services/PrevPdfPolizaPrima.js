import Api from "./Api";
import Helpers from "../common/helpers/helpers/Helpers";

const BaseUrl = "/prev-pdf-poliza-prima/";

let _index = 0;

class PrevPdfPolizaPrima {
    static async get(plan, quoteId) {
        let user = await Helpers.getUser();
        try {
            return await Api.post(BaseUrl + quoteId, plan, undefined, undefined, {
                pelhauthorization: user !== null ? user["accessToken"] : ""
            }, true);
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
