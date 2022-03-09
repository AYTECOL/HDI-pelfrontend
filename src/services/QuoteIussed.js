import Api from './Api';
import AuthHeader from './AuthHeader';
const BaseUrl = '/new/quote-iussed';

class QuoteIussed {
  static async get(persons) {
    // TODO intercept request
    let authHeader = new AuthHeader();
    authHeader = authHeader.generateAuthCode();
    return await Api.post(BaseUrl, persons, undefined, undefined, authHeader);
  }
}

export default QuoteIussed;
