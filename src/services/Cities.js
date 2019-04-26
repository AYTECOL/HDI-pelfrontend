import Api from './Api';

const Url = "/cities";

class Cities {
    static async get() {
        return await Api.get(Url);
    };
}

export default Cities;
