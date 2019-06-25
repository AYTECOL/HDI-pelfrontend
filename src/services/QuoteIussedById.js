import Api from "./Api";

const BaseUrl = "/get/all/quote-iussed-by-id/";

class QuoteIussedById {
    static async get(id) {
        return await Api.get(BaseUrl + id);
    }
}

export default QuoteIussedById;
