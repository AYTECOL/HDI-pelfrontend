import Service from './Service';

const Url = "/counter";

class Counter {
    static async get() {
        return await Service.put(Url);
    };
}

export default Counter;
