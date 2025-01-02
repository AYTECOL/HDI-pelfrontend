import Api from './Api';
import Helpers from '../common/helpers/helpers';
import AuthHeader from './AuthHeader';
const BaseUrl = '/all-plans';

class AllPlans {
  static async get({ type, quoteId }) {
    let data = [];
    try {
      // TODO interceptor or request
      let authHeader = new AuthHeader();
      authHeader = authHeader.generateAuthCode();
      data = await Api.get(
        BaseUrl + '/' + type + '/' + quoteId,
        undefined,
        authHeader
      );
      data = data.plans;
    } catch (e) {
      data = [];
    }
    data = Helpers.orderArray(data, 'order');
    return data;
  }
}

export default AllPlans;
