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
                "tipoDocumento": {"codigo": type},
                "numeroDocumento": value,
                "consultarCreditScore": true,
                "consultarAniosExperiencia": false
            }
        };

        let token = await Helpers.getUser();
        token = token === null ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudGUiOiI0MDkwODMzIiwiYXBwIjoiQ09UV0VCIiwibm9tYnJlVXN1YXJpbyI6IiwgQVNFU09SSUFTIEVOIFNFR1VST1MgVVJJQkUgTE9QRVogWSBDSUEuIExUREEuIChDb2xvbWJpYSkiLCJwZXJmaWwiOiJURF9DT1RXRUIiLCJzdGljayI6IjIwMTkuMDUuMzEgMTEuNTMuMjcuNjE2IiwidXN1YXJpbyI6ImNjMTIzNDU1MDAiLCJjbGllbnRfaWQiOiJvSTVWa1Z6anpFUzQ3ODZYd0VoVkRBZHlOM0FwaWFUTSIsImNsaWVudF9zZWNyZXQiOiJNTmhySkdQNmNHNDE5Nkd0IiwiaWF0IjoxNTU5MzIxNjU1LCJleHAiOjE1NTk0MDgwNTV9.jUkQ0Hj3QlLBPzB0AIY03G1CUwjqEsTK46VzHsPU1qk' : token.accessToken;
        return await Service.post(Baseurl, data, UrlServicePerson, undefined, {
            "Authorization": "Bearer " + token
        });
    };
}

export default Consultapersonas;