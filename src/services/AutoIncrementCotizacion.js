import Service from './Service';

const Url = "https://jnvmb2ndq8.execute-api.us-east-1.amazonaws.com/dev/counter";

class AutoIncrementCotizacion {
    static async get() {
        return await Service.put(Url);
    };
}

export default AutoIncrementCotizacion;
