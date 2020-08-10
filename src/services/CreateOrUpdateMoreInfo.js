import Api from "./Api";
import AuthHeader from './AuthHeader';
const BaseUrl = "/create-or-update/more-info";

class CreateOrUpdateMoreInfo {
    static async get(persons) {
        let authHeader =  new AuthHeader()
        authHeader = authHeader.generateAuthCode()
        return await Api.post(BaseUrl, persons, undefined, undefined, authHeader);
    }
}

export default CreateOrUpdateMoreInfo;
