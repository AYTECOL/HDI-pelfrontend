// TODO authentication interceptor
import Api from './Api';
import { UrlAccessToken } from '../config';

const Url = '/access-token';
const BaseUrl = UrlAccessToken;

class AccessToken {
  static async get(refer) {
    refer = decodeURIComponent(refer.replace(/\+/g, '%20'));
    let data = {
      refer: refer,
    };
    try {
      let reponse = await Api.post(Url, data, BaseUrl);
      if (typeof reponse['accessToken'] !== 'undefined') {
        const { agente, accessToken } = reponse;
        localStorage.setItem('intermediateCode', agente);
        localStorage.setItem('serviceToken', accessToken);
        return reponse;
      } else {
        return null;
      }
    } catch (e) {
      if (e.status === 401) {
        return null;
      }
    }
  }
}

export default AccessToken;
