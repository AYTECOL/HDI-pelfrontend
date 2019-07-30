import Api from './Api';
import Helpers from "../common/helpers/helpers/Helpers";
import {UrlAttachPolicyDocuments} from "../config";

const Url = "/attach-policy-documents";
const UrlLiberty = UrlAttachPolicyDocuments;

class AttachPolicyDocuments {
    static async get(poliza, emision) {
        let user = await Helpers.getUser();
        return await Api.get(Url + "/" + poliza + "/" + emision, undefined, {
            pelhauthorization: user !== null ? user["accessToken"] : ""
        });
    };

    static async save(data) {
        let user = await Helpers.getUser();
        try {
            return await Api.post('/adjuntardocumentospoliza', data, UrlLiberty, undefined, {
                Authorization: user !== null ? "Bearer " + user['accessToken'] : ''
            });
        }catch (e) {
            return null;
        }
    }
}

export default AttachPolicyDocuments;
