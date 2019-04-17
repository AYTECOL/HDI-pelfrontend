import Service from './Service';

class Identifications {
    static async get() {
        return await Service.get('https://o78mqwmm0l.execute-api.us-east-1.amazonaws.com/dev/identifications');
    };
}

export default Identifications;
