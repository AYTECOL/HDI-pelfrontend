import Service from './Api';
import Helpers from "../common/helpers/helpers/Helpers";

const UrlServicePerson = "https://fay88y18qk.execute-api.us-east-1.amazonaws.com/dev/";
const Baseurl = "consultarpersona";

class Consultapersonas {
    static async get(type, value) {
        let data = {
            "consultarPersonaRq": {
                "infoRequest": {
                    "requestID": "456234",
                    "fecha": "2017-02-17T00:00:00.000-05:00",
                    "aplicacionCliente": "fefa",
                    "terminal": "1",
                    "ip": "1.1.1.1"
                },
                "tipoDocumento": { "codigo": type },
                "numeroDocumento": value,
                "consultarCreditScore": true,
                "consultarAniosExperiencia": false
            }
        };

        let token = await Helpers.getUser();
        token = token === null ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDbGF2ZSI6IjQwOTA4MzMiLCJFbWFpbCI6ImRhcmkuaGVybmFuZGV6QGxpYmVydHljb2xvbWJpYS5jb20iLCJOdW1lcm9JZCI6IjEyMzQ1NTAwIiwiU3VyY3Vyc2FsIjoiMTE5IiwiVGlwb0lkIjoiQ0MiLCJuYW1lIjoidmFyaWFzIGNsYXZlcywgQU5BIElTQUJFTCAoQ29sb21iaWEpIiwic3RpY2siOiIyMDE5LjA1LjI5IDE1LjE0LjU2LjE2MSIsInVzdWFyaW8iOiJjYzEyMzQ1NTAwIiwidXN1YXJpb0JQTSI6IkxJcy80c2tHRVNsZHE0dGprZkJMS2c9PSIsImNsaWVudF9pZCI6Im9JNVZrVnpqekVTNDc4Nlh3RWhWREFkeU4zQXBpYVRNIiwiY2xpZW50X3NlY3JldCI6Ik1OaHJKR1A2Y0c0MTk2R3QiLCJpYXQiOjE1NTkxNjA4OTgsImV4cCI6MTU1OTI0NzI5OH0.o-Ck95r9Z5DS6r9vDS4LhXdP8_Hr4-fQvnp-xsd9qxA':token.accessToken;
        return await Service.post(Baseurl, data, UrlServicePerson, undefined, {
            "Authorization": "Bearer "+token
        });
    };
}

export default Consultapersonas;