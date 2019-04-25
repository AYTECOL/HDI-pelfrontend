import Service from './Service';
import Store from '../store';
import {AllPlans as AllPlansCreator} from '../actionCreators';

const BaseUrl = "/all-plans";

class AllPlans {
    static async get(type) {
        let data = [];
        try {
            data = await Service.get(BaseUrl +"/"+ type);
            data = data.plans;
        } catch (e) {
            data = [];
        }
        Store.dispatch(AllPlansCreator(data));
        return data;
    };
}

export default AllPlans;

