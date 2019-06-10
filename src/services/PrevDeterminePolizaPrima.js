import Api from './Api';

const BaseUrl = "/prev-determine-poliza-prima/";
const hybrid = "https://fvu7ki6lb3.execute-api.us-east-1.amazonaws.com/dev";


class PrevDeterminePolizaPrima {
    static async post(id, data) {
        return await Api.post(BaseUrl + id, data, hybrid);
    };
}

export default PrevDeterminePolizaPrima;