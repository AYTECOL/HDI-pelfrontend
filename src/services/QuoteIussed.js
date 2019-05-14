import Api from './Api';

const BaseUrl = "/new/quote_iussed/";

class QuoteIussed {
    static async get(persons) {
        let response = await Api.post(BaseUrl, persons);
        console.log(response);
        return response;
    };
}

export default QuoteIussed;
