import Service from './Api';

// const UrlServicePerson = "https://4yt70dl1a7.execute-api.us-east-1.amazonaws.com/dev/flex/";
const UrlServicePerson = "https://fay88y18qk.execute-api.us-east-1.amazonaws.com/dev/";
const Baseurl = "consultarpersona";

/*class Consultapersonas {
    static async get(type, value) {
        return await Service.post(Baseurl + type + "/" + value, {}, "");
    };
}*/

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
        return await Service.post(Baseurl, data, UrlServicePerson, undefined, {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDbGF2ZSI6IjQwOTA4MzMiLCJFbWFpbCI6ImRhcmkuaGVybmFuZGV6QGxpYmVydHljb2xvbWJpYS5jb20iLCJOdW1lcm9JZCI6IjEyMzQ1NTAwIiwiU3VyY3Vyc2FsIjoiMTE5IiwiVGlwb0lkIjoiQ0MiLCJuYW1lIjoidmFyaWFzIGNsYXZlcywgQU5BIElTQUJFTCAoQ29sb21iaWEpIiwic3RpY2siOiIyMDE5LjA1LjI0IDA4LjQzLjQ0LjYwNiIsInVzdWFyaW8iOiJjYzEyMzQ1NTAwIiwidXN1YXJpb0JQTSI6IkxJcy80c2tHRVNsZHE0dGprZkJMS2c9PSIsImNsaWVudF9pZCI6Im9JNVZrVnpqekVTNDc4Nlh3RWhWREFkeU4zQXBpYVRNIiwiY2xpZW50X3NlY3JldCI6Ik1OaHJKR1A2Y0c0MTk2R3QiLCJpYXQiOjE1NTg3MDU0MjYsImV4cCI6MTU1ODc5MTgyNn0.K-_IwJGi27yUATs3VDLfpMg2bszYbGea1EklqCaip7Y"
        });
    };
}

export default Consultapersonas;