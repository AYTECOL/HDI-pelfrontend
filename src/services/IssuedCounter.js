import Api from './Api';
import AuthHeader from './AuthHeader';
const Url = '/issued_counter';

class IssuedCounter {
  static async get() {
    // TODO intercept request
    let authHeader = new AuthHeader();
    authHeader = authHeader.generateAuthCode();
    return await Api.put(Url, undefined, authHeader);
  }
}

export default IssuedCounter;
