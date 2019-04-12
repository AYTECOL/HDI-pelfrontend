import Service from './Service';

const BaseUrl = "https://jnvmb2ndq8.execute-api.us-east-1.amazonaws.com/dev/all-plans";

class AllPlans {
    static async get() {
        let data = await Service.get(BaseUrl);
        return data.plans;
    };
}

export default AllPlans;

