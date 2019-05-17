import Api from './Api';

const BaseUrl = "/new/file";
const hybrid = "https://fvu7ki6lb3.execute-api.us-east-1.amazonaws.com/dev";

class SarlaftFile {
    static async upload(data) {
        return await Api.files(BaseUrl, data, hybrid);
    };
}

export default SarlaftFile;
