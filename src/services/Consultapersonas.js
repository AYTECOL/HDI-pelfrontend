import Service from './Service';
import {UrlServicePerson} from '../config';

const Baseurl = "/flex/";

class Consultapersonas {
    static async get(type, value) {
        return await Service.post(Baseurl + type + "/" + value, {}, UrlServicePerson);
    };
}

export default Consultapersonas;
