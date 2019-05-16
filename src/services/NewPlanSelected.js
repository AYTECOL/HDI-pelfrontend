import Api from './Api';

const BaseUrl = "/new/plan-selected";
const hybrid = "https://fvu7ki6lb3.execute-api.us-east-1.amazonaws.com/dev";

class NewPlanSelected {
    static async get(persons) {
        return await Api.post(BaseUrl, persons, hybrid);
    };
}

export default NewPlanSelected;
