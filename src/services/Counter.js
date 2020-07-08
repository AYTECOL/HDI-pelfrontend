import Api from './Api';
import AuthHeader from './AuthHeader';
const Url = "/counter";

class Counter {
    static async get() {
      // TODO interceptor or request
      let authHeader =  new AuthHeader()
      authHeader = authHeader.generateAuthCode()
      return await Api.put(Url, undefined, authHeader);
    };
}

export default Counter;
