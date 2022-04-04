import Api from './Api';
import AuthHeader from './AuthHeader';

class Identifications {
  static async get() {
    let authHeader = new AuthHeader();
    authHeader = authHeader.generateAuthCode();
    return await Api.get('/identifications', undefined, authHeader);
  }
}

export default Identifications;
