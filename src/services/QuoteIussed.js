import Api from "./Api";

const BaseUrl = "/new/quote-iussed";

class QuoteIussed {
    static async get(persons) {
        return await Api.post(BaseUrl, persons);
    }
}

export default QuoteIussed;
