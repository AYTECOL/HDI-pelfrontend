import Service from './Service';

const Url = "/counter";

class AutoIncrementCotizacion {
    static async get() {
        return await Service.put(Url);
    };
}

export default AutoIncrementCotizacion;
