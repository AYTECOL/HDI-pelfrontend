import Api from './Api';

const Url = "/issued_counter";

class IssuedCounter {
    static async get() {
        return await Api.put(Url);
    };
}

export default IssuedCounter;
