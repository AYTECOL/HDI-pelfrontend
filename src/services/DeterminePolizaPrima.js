import Api from './Api';
import Helpers from "../common/helpers/helpers/Helpers";

const BaseUrl = "/prev-determine-poliza-prima/";
const hybrid = "https://fvu7ki6lb3.execute-api.us-east-1.amazonaws.com/dev";

class DeterminePolizaPrima {
    static async get(data, id) {
        let user = await Helpers.getUser();
        return await Api.post(BaseUrl + id, data, hybrid, undefined, {
            pelhauthorization: user!==null?user['accessToken']:''
        });
    };
}

export default DeterminePolizaPrima;
