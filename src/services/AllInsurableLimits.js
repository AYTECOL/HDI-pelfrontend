import Store from '../store';
import AuthHeader from './AuthHeader';
import { saveAllInsurableLimits } from '../store/actions';
import Helpers from '../common/helpers/helpers';
import Axios from 'axios';
import { UrlService } from '../config';

const BaseUrl = '/all-insurable-limits';

class AllInsurableLimits {
  static async get(id) {
    let data = {};
    let allInsurableLimits = [];
    let storeState = Store.getState();
    if (storeState.allInsurableLimits.length === 0) {
      try {
        // TODO interceptor or request
        let authHeader = new AuthHeader();
        authHeader = authHeader.generateAuthCode();
        // const url = `${UrlService.replace(
        //   /['"]+/g,
        //   ''
        // ).trim()}${BaseUrl.trim()}/${id ?? storeState.cotizacion.number}`;
        const url =
          UrlService + BaseUrl + '/' + (id ?? storeState.cotizacion.number);
        data = await Axios.get(url, { headers: authHeader })
          .then(({ data }) => data)
          .catch((error) => {
            throw error;
          });
        //data = await Api.get(BaseUrl, undefined, authHeader);
      } catch (e) {
        console.log('🎉 error desde el servicio', JSON.stringify(e));
        const { status } = e?.response || {};
        return {
          code: status || 400,
        };
      }
      allInsurableLimits = Helpers.orderArray(
        data.limits,
        'insurable_limit_id'
      );

      let newData = [];
      for (let i = 0; i < allInsurableLimits.length; i++) {
        newData[allInsurableLimits[i].insurable_limit_id] =
          allInsurableLimits[i];
      }
      allInsurableLimits = newData;
      Store.dispatch(saveAllInsurableLimits(allInsurableLimits));
    } else {
      allInsurableLimits = storeState.allInsurableLimits;
    }
    return allInsurableLimits;
  }
}

export default AllInsurableLimits;