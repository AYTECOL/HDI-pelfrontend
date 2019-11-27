import Api from "./Api";
import ConsultaPersonas from "./ConsultaPersonas";

const Url = "/emit-policy";

class Policy {
    static async emit(quoteId, data) {
        let user = await ConsultaPersonas.getUser();
        return await Api.post(Url, data, undefined, undefined, {
            pelhauthorization: user !== null ? user["accessToken"] : ""
        });
    }
}

export default Policy;
