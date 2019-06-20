import Api from "./Api";

const BaseUrl = "/new/quote-iussed";
const hybrid = "https://fvu7ki6lb3.execute-api.us-east-1.amazonaws.com/dev";

class QuoteIussed {
  static async get(persons) {
    return await Api.post(BaseUrl, persons, hybrid);
  }
}

export default QuoteIussed;
