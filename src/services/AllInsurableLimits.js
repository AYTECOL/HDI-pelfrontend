import Api from './Api';
import Store from '../store';
import { saveAllInsurableLimits } from '../actions';
import Helpers from '../common/helpers/helpers/Helpers';

const BaseUrl = '/all-insurable-limits';

const Default = () => ({
  limits: [
    {
      insurable_limit_id: '2',
      description: 'Contenidos',
      min_value: 1000000,
      max_value: 1000000000
    },
    {
      insurable_limit_id: '1',
      description: 'Inmueble',
      min_value: 2000000,
      max_value: 4000000000
    },
    {
      insurable_limit_id: '6',
      description: 'Teléfonos móviles',
      min_value: 900000,
      max_value: 10000000
    },
    {
      insurable_limit_id: '5',
      description: 'Contenidos móviles',
      min_value: 1000000,
      max_value: 160000000
    },
    {
      insurable_limit_id: '4',
      description: 'Joyas',
      min_value: 900000,
      max_value: 100000000
    },
    {
      insurable_limit_id: '3',
      description: 'Obras de Arte',
      min_value: 1,
      max_value: 600000000
    }
  ],
  status: 200
});

class AllInsurableLimits {
  static async get() {
    let data = {};
    let allInsurableLimits = [];
    let storeState = Store.getState();
    if (storeState.allInsurableLimits.length === 0) {
      try {
        data = await Api.get(BaseUrl);
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
