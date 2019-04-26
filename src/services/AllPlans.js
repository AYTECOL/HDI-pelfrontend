import Api from './Api';
import Store from '../store';
import {AllPlans as AllPlansCreator} from '../actions';

const BaseUrl = "/all-plans";

class AllPlans {
    static async get(type) {
        let data = [];
        try {
            data = await Api.get(BaseUrl +"/"+ type);
            data = data.plans;
        } catch (e) {
            data = [];
        }
        Store.dispatch(AllPlansCreator(data));
        console.log(data);
        return data;
    };
}

export default AllPlans;

