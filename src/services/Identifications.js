import Api from './Api';

class Identifications {
    static async get() {
        return await Api.get('/identifications');
    };
}

export default Identifications;
