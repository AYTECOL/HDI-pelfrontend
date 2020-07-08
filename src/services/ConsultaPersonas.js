// TODO authentication interceptor
import Service from "./Api";
import { UrlPerson } from "../config";
import Base64 from "../common/helpers/base64/Base64";
import AccessToken from "./AccessToken";
import Helpers from "../common/helpers/helpers/Helpers";
import Loading from "../components/globals/loading/Loading";

const UrlServicePerson = UrlPerson;
const Baseurl = "/consultarpersona";

class ConsultaPersonas {
  static key = "request";
  static async getUser() {
    Loading.toggle(true);
    /**
     * @type {string|null}
     */
    let data = null;
    let queryString = window.location.search.replace("?", "").split("&");
    let parameters = {};
    window.history.pushState({}, document.title, window.location.pathname);
    for (let i = 0; i < queryString.length; i++) {
      let d = queryString[i].split("=");
      if (typeof d[1] !== "undefined") parameters[d[0]] = d[1];
    }
    if (typeof parameters["refer"] !== "undefined") {
      let dataRquest = await AccessToken.get(parameters["refer"]);
      if (dataRquest !== null) {
        dataRquest["refer"] = parameters["refer"];
        sessionStorage.clear();
        sessionStorage.setItem(
          ConsultaPersonas.key,
          Base64.encode(
            Base64.encode(Base64.encode(JSON.stringify(dataRquest)))
          )
        );
        data = dataRquest;
      } else {
        Helpers.goToError();
      }
    } else {
      let dataRquest = sessionStorage.getItem(ConsultaPersonas.key);
      if (typeof dataRquest === "undefined" || dataRquest === null) {
        Helpers.goToError();
        return data;
      }

      data = JSON.parse(
        Base64.decode(Base64.decode(Base64.decode(dataRquest)))
      );
      if (typeof data["refer"] === "undefined") {
        Helpers.goToError();
        return data;
      }
      // TODO authentication interceptor
      let dataRquestVerify = await AccessToken.get(data["refer"]);
      if (
        dataRquestVerify !== null &&
        typeof dataRquestVerify !== "undefined" &&
        typeof data["refer"] !== "undefined"
      ) {
        dataRquestVerify["refer"] = data["refer"];
        sessionStorage.clear();
        sessionStorage.setItem(
          ConsultaPersonas.key,
          Base64.encode(
            Base64.encode(Base64.encode(JSON.stringify(dataRquestVerify)))
          )
        );
      } else {
        Helpers.goToError();
      }
    }
    return data;
  }

  static async get(type, value) {
    let data = {
      consultarPersonaRq: {
        infoRequest: {
          requestID: "456234",
          fecha: "2017-02-17T00:00:00.000-05:00",
          aplicacionCliente: "fefa",
          terminal: "1",
          ip: "1.1.1.1"
        },
        tipoDocumento: { codigo: type },
        numeroDocumento: value,
        consultarCreditScore: true,
        consultarAniosExperiencia: false
      }
    };
    // TODO authentication interceptor. entry point 
    //return Default;
    let token = await ConsultaPersonas.getUser();
    token =
      token === null
        ? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudGUiOiI0MDkwODMzIiwiYXBwIjoiQ09UV0VCIiwibm9tYnJlVXN1YXJpbyI6IiwgQVNFU09SSUFTIEVOIFNFR1VST1MgVVJJQkUgTE9QRVogWSBDSUEuIExUREEuIChDb2xvbWJpYSkiLCJwZXJmaWwiOiJURF9DT1RXRUIiLCJzdGljayI6IjIwMTkuMDUuMzEgMTEuNTMuMjcuNjE2IiwidXN1YXJpbyI6ImNjMTIzNDU1MDAiLCJjbGllbnRfaWQiOiJvSTVWa1Z6anpFUzQ3ODZYd0VoVkRBZHlOM0FwaWFUTSIsImNsaWVudF9zZWNyZXQiOiJNTmhySkdQNmNHNDE5Nkd0IiwiaWF0IjoxNTU5MzIxNjU1LCJleHAiOjE1NTk0MDgwNTV9.jUkQ0Hj3QlLBPzB0AIY03G1CUwjqEsTK46VzHsPU1qk"
        : token.accessToken;
    return await Service.post(Baseurl, data, UrlServicePerson, undefined, {
      Authorization: "Bearer " + token
    });
  }

  static logout() {
    sessionStorage.removeItem(ConsultaPersonas.key);
    document.location.replace("/");
    document.location.replace("https://oficinaenlinea.libertyseguros.co");
  }
}

export default ConsultaPersonas;
