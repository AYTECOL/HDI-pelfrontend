import Api from './Api';

const BaseUrl = "/determine-poliza-prima/";

class DeterminePolizaPrima {
    static async get(id) {
        return await Api.get(BaseUrl + id);
    };
}

export default DeterminePolizaPrima;