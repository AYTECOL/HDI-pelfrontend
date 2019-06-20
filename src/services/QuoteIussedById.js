import Api from "./Api";

const BaseUrl = "/get/all/quote-iussed-by-id/";
const hybrid = "https://fvu7ki6lb3.execute-api.us-east-1.amazonaws.com/dev";

class QuoteIussedById {
    static async get(id) {
        return await Api.get(BaseUrl + id, hybrid);
    }
}

export default QuoteIussedById;
