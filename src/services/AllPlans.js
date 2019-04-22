import Service from './Service';
import Store from '../store';
import {AllPlans as AllPlansCreator} from '../actionCreators';

const BaseUrl = "/all-plans";

class AllPlans {
    static async get() {
        let data = [];
        let storeState = Store.getState();
        if (storeState.AllPlans.length === 0) {
            try {
                data = await Service.get(BaseUrl);
                data = data.plans;
            }catch (e) {
                data = [];
            }
            Store.dispatch(AllPlansCreator(data));
        } else {
            data = storeState.AllPlans;
        }
        return data;
    };
}

export default AllPlans;

