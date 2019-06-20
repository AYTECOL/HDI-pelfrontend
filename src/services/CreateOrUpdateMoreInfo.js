import Api from "./Api";

const BaseUrl = "/create-or-update/more-info";
const hybrid = "https://fvu7ki6lb3.execute-api.us-east-1.amazonaws.com/dev";

class CreateOrUpdateMoreInfo {
  static async get(persons) {
    return await Api.post(BaseUrl, persons, hybrid);
  }
}

export default CreateOrUpdateMoreInfo;
