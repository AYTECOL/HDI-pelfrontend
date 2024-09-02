import Store from '../store';
import AuthHeader from './AuthHeader';
import { saveEstate } from '../store/actions';
import Axios from 'axios';
import { UrlService } from '../config';

const BaseUrl = '/related-individual-estates';

class GetEstate {
  static async get(id) {
    let data = {};
    let estate = [];
    let storeState = Store.getState();
    if (Object.keys(storeState.estate).length == 0) {
      try {
        // TODO interceptor or request
        let authHeader = new AuthHeader();
        authHeader = authHeader.generateAuthCode();
        const url = `${UrlService.replace(
          /['"]+/g,
          ''
        ).trim()}${BaseUrl.trim()}/${id ?? storeState.cotizacion.number}`;
        // const url =
        //   UrlService + BaseUrl + '/' + (id ?? storeState.cotizacion.number);
        data = await Axios.get(url, { headers: authHeader })
          .then(({ data }) => data)
          .catch((error) => {
            throw error;
          });
      } catch (e) {
        const { data } = e?.response?.data || {};
        return {
          code: data?.statusCode || 400,
          error: data?.error || '',
        };
      }
      estate = data;
      Store.dispatch(saveEstate(estate));
    } else {
      estate = storeState.estate;
    }
    return estate;
  }
}

export default GetEstate;
