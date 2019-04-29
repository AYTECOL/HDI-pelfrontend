import Service from './Api';
import {UrlServicePerson} from '../config';

const Baseurl = "https://4yt70dl1a7.execute-api.us-east-1.amazonaws.com/dev/flex/";

class Consultapersonas {
    static async get(type, value) {
        return await Service.post(Baseurl + type + "/" + value, {}, "");
    };
}

export default Consultapersonas;