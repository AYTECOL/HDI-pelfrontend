import Api from "./Api";

const BaseUrl = "/new/file";

class UploadFile {
    static async upload(name, data) {
        return await Api.files(BaseUrl, name, data);
    }
}

export default UploadFile;
