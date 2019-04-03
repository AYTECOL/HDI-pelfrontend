import Service from './Service';

class Identifications {
    static async get() {
        return await Service.get('https://mnkg7plc7i.execute-api.us-east-1.amazonaws.com/dev/identifications');
    };
}

export default Identifications;
