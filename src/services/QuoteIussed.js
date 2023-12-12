import Api from './Api';
import AuthHeader from './AuthHeader';
const BaseUrl = '/new/quote-iussed';

class QuoteIussed {
  static async post(payload) {
    let authHeader = new AuthHeader();
    authHeader = authHeader.generateAuthCode();
    return await Api.post(BaseUrl, payload, undefined, undefined, authHeader);
  }
}

export default QuoteIussed;
