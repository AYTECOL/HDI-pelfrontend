import Api from './Api';
import Store from '../store';
import {AllPlans as AllPlansCreator} from '../actions';
import Helpers from "../common/helpers/helpers/Helpers";

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
        data = Helpers.orderArray(data,"order");
        Store.dispatch(AllPlansCreator(data));
        return data;
    };
}

export default AllPlans;

