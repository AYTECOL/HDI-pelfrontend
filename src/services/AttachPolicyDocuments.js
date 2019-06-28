import Api from './Api';
import Helpers from "../common/helpers/helpers/Helpers";

const Url = "/attach-policy-documents";

class AttachPolicyDocuments {
    static async get(poliza, emision) {
        let user = await Helpers.getUser();
        return await Api.get(Url+"/"+poliza+"/"+emision, undefined, {
            pelhauthorization: user !== null ? user["accessToken"] : ""
        });
    };
}

export default AttachPolicyDocuments;
