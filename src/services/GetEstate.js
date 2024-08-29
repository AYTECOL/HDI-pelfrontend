import Store from '../store';
import AuthHeader from './AuthHeader';
import { saveEstate } from '../store/actions';
import Helpers from '../common/helpers/helpers';
import Axios from 'axios';
import { UrlService } from '../config';

const BaseUrl = '/estate';

class GetEstate {
  static async get() {
    let data = {};
    let estate = [];
    let storeState = Store.getState();
    if (storeState.estate.length === 0) {
      try {
        // TODO interceptor or request
        let authHeader = new AuthHeader();
        authHeader = authHeader.generateAuthCode();
        const url = UrlService + BaseUrl;
        data = {
          Estate: [
            {
              id: 0,
              label: 'Contenido Fijo',
              max: 50000000,
              required: false,
            },
            {
              id: 1,
              label: 'Objetos de valor y obras de Arte',
              max: 20000000,
              required: true,
            },
            { id: 2, label: 'Joyas', max: 20000000, required: true },
            { id: 3, label: 'Celulares', max: 4000000, required: true },
            {
              id: 4,
              label: 'Contenido Movil',
              max: 20000000,
              required: true,
            },
          ],
        };
        // data = await Axios.get(url, { headers: authHeader })
        //   .then(({ data }) => data)
        //   .catch((error) => {
        //     throw error;
        //   });
      } catch (e) {
        const { data } = e?.response?.data || {};
        return {
          code: data?.statusCode || 400,
          error: data?.error || "",
        };
      }
      estate = Helpers.orderArray(
        data.limits,
        'id'
      );

      let newData = [];
      for (let i = 0; i < estate.length; i++) {
        newData[estate[i].insurable_limit_id] =
        estate[i];
      }
      estate = newData;
      Store.dispatch(saveEstate(estate));
    } else {
        estate = storeState.estate;
    }
    return estate;
  }
}

export default GetEstate;
