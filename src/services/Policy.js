import Api from "./Api";
import Helpers from "../common/helpers/helpers/Helpers";

const Url = "/emit-policy/";

class Policy {
    static async emit(quoteId) {
        let user = await Helpers.getUser();
        return await Api.get(Url + quoteId, undefined, {
            pelhauthorization: user !== null ? user["accessToken"] : ""
        });
    }
}

export default Policy;
