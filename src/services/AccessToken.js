// TODO authentication interceptor
import Api from './Api';
import { UrlAccessToken } from '../config';
import store from 'store';
import { setAuthUser } from 'store/actions';

const Url = '/access-token';
const BaseUrl = UrlAccessToken;

class AccessToken {
  static async get(refer) {
    console.log('reder', refer);
    if (refer === '') return;
    store.dispatch(setAuthUser(null));
    refer = decodeURIComponent(refer.replace(/\+/g, '%20'));
    let data = {
      refer: refer,
    };
    try {
      let response = await Api.post(Url, data, BaseUrl);
      if (typeof response['accessToken'] !== 'undefined') {
        store.dispatch(setAuthUser(response));
        const { accessToken } = response;
        localStorage.setItem('serviceToken', accessToken);
        return response;
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
