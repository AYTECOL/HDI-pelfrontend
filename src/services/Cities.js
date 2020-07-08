import Api from './Api';
import AuthHeader from './AuthHeader';
const Url = "/cities";

class Cities {
    static async get() {
      // TODO interceptor or request
      let authHeader =  new AuthHeader()
      authHeader = authHeader.generateAuthCode()
      return await Api.get(Url, undefined, authHeader);
    };
}

export default Cities;
