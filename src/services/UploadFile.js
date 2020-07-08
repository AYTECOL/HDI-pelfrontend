import Api from "./Api";
import AuthHeader from './AuthHeader';
const BaseUrl = "/new/file";

class UploadFile {
    static async upload(name, data) {
        // TODO intercept request
        let authHeader =  new AuthHeader();
        authHeader = authHeader.generateAuthCode();
        return await Api.files(BaseUrl, name, data, undefined, authHeader);
    }
}

export default UploadFile;
