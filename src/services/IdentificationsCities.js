import Service from './Service';

class IdentificationsCities {
    static async get() {
        return await Service.get('https://vit27249i5.execute-api.us-east-1.amazonaws.com/dev/cities');
    };
}

export default IdentificationsCities;
