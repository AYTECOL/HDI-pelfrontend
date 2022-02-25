import Api from './Api';
import Helpers from '../common/helpers/helpers/Helpers';
import AuthHeader from './AuthHeader';
const BaseUrl = '/all-plans';

class AllPlans {
  static async get(type) {
    let data = [];
    try {
      // TODO interceptor or request
      let authHeader = new AuthHeader();
      authHeader = authHeader.generateAuthCode();
      data = await Api.get(BaseUrl + '/' + type, undefined, authHeader);
      data = data.plans;
    } catch (e) {
      data = [];
    }
    data = Helpers.orderArray(data, 'order');
    return data;
  }
}

export default AllPlans;
