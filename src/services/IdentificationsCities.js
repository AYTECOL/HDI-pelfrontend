import Service from './Service';

const Url = "https://7d3sljey48.execute-api.us-east-1.amazonaws.com/dev/cities";
class IdentificationsCities {
    static async get() {
        return await Service.get(Url);
    };
}

export default IdentificationsCities;
