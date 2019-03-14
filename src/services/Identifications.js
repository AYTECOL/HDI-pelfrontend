import Service from './Service';

class Identifications {
    static async get() {
        return await Service.get('identifications');
    };
}

export default Identifications;
