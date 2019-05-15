import Api from './Api';

const BaseUrl = "/new/quote_iussed";
const hybrid = "https://fvu7ki6lb3.execute-api.us-east-1.amazonaws.com/dev";

class QuoteIussed {
    static async get(persons) {
        let response = await Api.post(BaseUrl, persons, hybrid);
        console.log(response);
        return response;
    };
}

export default QuoteIussed;
