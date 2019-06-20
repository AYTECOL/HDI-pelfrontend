import Api from "./Api";

const BaseUrl = "/new/file";
const hybrid = "https://fvu7ki6lb3.execute-api.us-east-1.amazonaws.com/dev";

class UploadFile {
    static async upload(name, data) {
        return await Api.files(BaseUrl, name, data, hybrid);
    }
}

export default UploadFile;
