import Api from "./Api";
import Helpers from "../common/helpers/helpers/Helpers";

const Url = "/emit-policy";

class Policy {
    static async emit(quoteId, data) {
        let user = await Helpers.getUser();
        return await Api.post(Url, data, undefined, undefined, {
            pelhauthorization: user !== null ? user["accessToken"] : ""
        });
    }
}

export default Policy;
