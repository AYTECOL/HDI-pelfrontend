import Api from "./Api";

const BaseUrl = "/new/plan-selected";

class NewPlanSelected {
    static async get(persons) {
        return await Api.post(BaseUrl, persons);
    }
}

export default NewPlanSelected;
