import Api from './Api';
import Helpers from "../common/helpers/helpers/Helpers";

const Url = "/attach-policy-documents";
const UrlLiberty = "https://fay88y18qk.execute-api.us-east-1.amazonaws.com/dev/";


class AttachPolicyDocuments {
    static async get(poliza, emision) {
        let user = await Helpers.getUser();
        return await Api.get(Url + "/" + poliza + "/" + emision, undefined, {
            pelhauthorization: user !== null ? user["accessToken"] : ""
        });
    };

    static async save(data) {
        let user = await Helpers.getUser();
        return await Api.post('adjuntardocumentospoliza', data, UrlLiberty, undefined, {
            Authorization: user !== null ? "Bearer " + user['accessToken'] : ''
        });
    }
}

export default AttachPolicyDocuments;
