import Api from "./Api";

const BaseUrl = "/create-or-update/more-info";

class CreateOrUpdateMoreInfo {
    static async get(persons) {
        return await Api.post(BaseUrl, persons);
    }
}

export default CreateOrUpdateMoreInfo;
