import Service from './Service';
import {UrlServicePerson} from '../config';

const Baseurl = "/consultarpersona";

class Consultapersonas {
    static async get(type, value) {
        let data = {
            "authorization": {
                "client_id": "nckAAAY0yKY3VDV3ugeAXdW1QIiGs0ky",
                "client_secret": "0qlVyO0AMsj3GrHL"
            },
            "consultarPersonaRq": {
                "infoRequest": {
                    "requestID": "456234",
                    "fecha": "2017-02-17T00:00:00.000-05:00",
                    "aplicacionCliente": "fefa",
                    "terminal": "1",
                    "ip": "1.1.1.1"
                },
                "tipoDocumento": {
                    "codigo": type
                },
                "numeroDocumento": value
            }
        };
        return await Service.post(Baseurl, data, UrlServicePerson);
    };
}

export default Consultapersonas;
