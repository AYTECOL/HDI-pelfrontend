import Api from './Api';
import Store from '../store';
import AuthHeader from './AuthHeader';
import { saveAllInsurableLimits } from '../store/actions';
import Helpers from '../common/helpers/helpers';
import { typeItems } from '../common/typeItems';

const BaseUrl = '/all-insurable-limits';
const Default = () => ({
  limits: [
    {
      insurable_limit_id: '2',
      description: 'Contenidos',
      min_value: 10000000,
      max_value: 1000000000,
      maximumPerItem: typeItems.fixedContent.max,
    },
    {
      insurable_limit_id: '1',
      description: 'Inmueble',
      min_value: 20000000,
      max_value: 4000000000,
    },
    {
      insurable_limit_id: '6',
      description: 'Teléfonos móviles',
      min_value: 1500000,
      max_value: 10000000,
      maximumPerItem: typeItems.cellPhones.max,
    },
    {
      insurable_limit_id: '5',
      description: 'Contenidos móviles',
      min_value: 1500000,
      max_value: 50000000,
      maximumPerItem: typeItems.mobileContent.max,
    },
    {
      insurable_limit_id: '4',
      description: 'Joyas',
      min_value: 1500000,
      max_value: 50000000,
      maximumPerItem: typeItems.jewelry.max,
    },
    {
      insurable_limit_id: '3',
      description: 'Objetos de valor y obras de Arte',
      min_value: 1500000,
      max_value: 100000000,
      maximumPerItem: typeItems.valuablesAndWorksOfArt.max,
    },
  ],
  status: 200,
});

class AllInsurableLimits {
  static async get() {
    let data = {};
    let allInsurableLimits = [];
    let storeState = Store.getState();
    if (storeState.allInsurableLimits.length === 0) {
      try {
        // TODO interceptor or request
        let authHeader = new AuthHeader();
        authHeader = authHeader.generateAuthCode();
        data = await Api.get(BaseUrl, undefined, authHeader);
      } catch (e) {
        data = Default();
      }
      if (!data.limits || !data.limits.length) {
        data = Default();
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
      allInsurableLimits = storeState.limits;
    }
    return allInsurableLimits;
  }
}

export default AllInsurableLimits;