import Api from './Api';

const Url = "/counter";

class Counter {
    static async get() {
        return await Api.put(Url);
    };
}

export default Counter;
