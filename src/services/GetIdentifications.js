import Service from './Service';

const Url = "https://jdo0rhqwmc.execute-api.us-east-1.amazonaws.com/dev/quote";

class GetIdentifications {
    static async get() {
        return await Service.get(Url);
    };
}

export default GetIdentifications;
