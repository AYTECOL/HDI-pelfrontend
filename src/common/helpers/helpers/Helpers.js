import { UrlSite } from "../../../config";
import Identifications from "../../../services/GetQuote";
import store from "../../../store";
import {
  restoreCotizacion,
  restoreCotizacionRisk,
  savePdfInfo,
  saveProspect
} from "../../../actions";
import ValorationById from "../../../services/ValorationById";

class Helpers {
  static toCapitalize(str) {
    var splitStr = str.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  }

  static hasClass(selector, className) {
    let el = document.querySelector(selector);
    if (el != null) {
      if (el.className.indexOf(className) !== -1) {
        return true;
      }
    }
    return false;
  }

  static disabled(selector) {
    let el = document.querySelector(selector);
    let className = "disabled";
    if (el != null) {
      if (el.className.indexOf(className) === -1) {
        el.className += " " + className;
        el.setAttribute(className, true);
      }
    }
  }

  static enabled(selector) {
    let el = document.querySelector(selector);
    let className = "disabled";
    if (el != null) {
      if (el.className.indexOf(className) !== -1) {
        el.className = el.className.replace(" " + className, "");
        el.removeAttribute(className);
      }
    }
  }

  static addClass(selector, className) {
    let el = document.querySelector(selector);
    if (el != null) {
      if (el.className.indexOf(className) === -1) {
        el.className += " " + className;
      }
    }
  }

  static removeClass(selector, className) {
    let el = document.querySelector(selector);
    if (el != null) {
      el.className = el.className.replace(" " + className, "");
    }
  }

  static scrollElement(size, scrollElement, inverse) {
    if (typeof scrollElement === "undefined") {
      scrollElement = window;
    } else {
      scrollElement = document.querySelector(scrollElement);
    }
    if (typeof inverse === "undefined") inverse = false;
    let scrollTop = scrollElement.scrollTop;
    scrollElement.scroll({
      top: inverse ? scrollTop - size : scrollTop + size,
      left: 0,
      behavior: "smooth"
    });
  }

  static scrollToElement(selector, scrollElement, behavior, ignoreZero) {
    let el = document.querySelector(selector);
    let top;

    if (typeof ignoreZero === "undefined") ignoreZero = false;

    function findValue(el) {
      if (
        el.offsetTop === 0 &&
        el.offsetParent !== null &&
        ignoreZero === false
      ) {
        return findValue(el.offsetParent);
      } else {
        return el.offsetTop;
      }
    }

    top = findValue(el);
    if (top === 0) return;
    if (typeof scrollElement === "undefined") behavior = "smooth";
    if (typeof scrollElement === "undefined") {
      scrollElement = window;
    } else {
      scrollElement = document.querySelector(scrollElement);
    }
    scrollElement.scroll({
      top: top,
      left: 0,
      behavior: behavior
    });
  }

  static orderArray(array, key) {
    return array.sort(function(a, b) {
      a = parseInt(a[key]);
      b = parseInt(b[key]);
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      }
      return 0;
    });
  }

  static orderArrayNumeric(a, b) {
    return a - b;
  }

  static goToNotFound(history) {
    history.push(UrlSite + "/404");
  }

  static goToHome(history) {
    history.push(UrlSite + "/");
  }

  static goToError() {
    if (window.location.pathname !== "/error") {
      window.location.href = UrlSite + "/error";
    }
  }

  static async getRowById(id, step, history) {
    let cotizacion = await Identifications.getById(id);
    if (typeof cotizacion.identification !== "undefined") {
      store.dispatch(restoreCotizacion(cotizacion));
      if (cotizacion.state === 7) {
        Helpers.goToNotFound(history);
      } else {
        if (cotizacion.state >= 2 && parseInt(step) >= 2) {
          let riskData = await ValorationById.get(id);
          if (riskData !== null) {
            store.dispatch(
              saveProspect({
                prospect: riskData.prospect,
                total_premium_policy: riskData.total_premium_policy,
                expedition_expenses: riskData.expedition_expenses,
                total_tax_policy: riskData.total_tax_policy,
                iva_expedition_expenses: riskData.iva_expedition_expenses
              })
            );
            store.dispatch(restoreCotizacionRisk(riskData));
          }
        }
      }
    } else if (
      typeof cotizacion.status !== "undefined" &&
      parseInt(step) !== 1
    ) {
      if (cotizacion.status === 400) {
        Helpers.goToNotFound(history);
      } else if (cotizacion.status === 0) {
        Helpers.goToHome(history);
      }
    }
  }

  static toggleSlide = index => () => {
    let className = "close_item";
    if (Helpers.hasClass(".row_tab_" + index, className)) {
      Helpers.removeClass(".row_tab_" + index, className);
    } else {
      let el = document.querySelector(".row_tab_" + index + " .wrapper-box ");
      if (el == null)
        el = document.querySelector(".row_tab_" + index + " .wrapper-box-info");
      el.style.height = el.offsetHeight + "px";
      Helpers.addClass(".row_tab_" + index, className);
    }
  };

  static fileFormats = [
    "image/*",
    "application/pdf"
  ];

  static validateFile(file) {
    if (typeof file !== "undefined") {
      return Helpers.fileFormats.some(
        (format) =>file.type.match(format)
      );
    }
  }

  static validationEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  static fieldNumeric = function() {
    let els = document.querySelectorAll("input.number");

    function validateNumber(e) {
      if (typeof e.which !== "undefined") {
        var k = e.which;
        if (
          !(
            e.shiftKey === false &&
            (k === 190 ||
              k === 46 ||
              k === 8 ||
              k === 37 ||
              k === 39 ||
              (k >= 48 && k <= 57))
          )
        ) {
          e.preventDefault();
          return;
        }
        if (
          (e.keyCode >= 65 && e.keyCode <= 90) ||
          e.keyCode === 188 ||
          e.keyCode === 190
        ) {
          e.preventDefault();
          return;
        }
      }
      e.target.value = e.target.value.replace(/\.(?=\.)|G(?!^)\.|`|,/gm, "");
    }

    for (let i = 0; i < els.length; i++) {
      let events = ["input", "change", "paste", "keypress"];
      for (let j = 0; j < events.length; j++) {
        els[i].addEventListener(events[j], validateNumber);
      }
    }
  };

  static calcularDigitoVerificacion(myNit) {
    // Se limpia el Nit
    myNit = myNit.toString();
    myNit = myNit.replace(/\s/g, ""); // Espacios
    myNit = myNit.replace(/,/g, ""); // Comas
    myNit = myNit.replace(/\./g, ""); // Puntos
    myNit = myNit.replace(/-/g, ""); // Guiones
    // Se valida el nit
    if (isNaN(myNit)) {
      return "";
    }
    // Procedimiento
    var vpri = new Array(16);
    var z = myNit.length;
    vpri[1] = 3;
    vpri[2] = 7;
    vpri[3] = 13;
    vpri[4] = 17;
    vpri[5] = 19;
    vpri[6] = 23;
    vpri[7] = 29;
    vpri[8] = 37;
    vpri[9] = 41;
    vpri[10] = 43;
    vpri[11] = 47;
    vpri[12] = 53;
    vpri[13] = 59;
    vpri[14] = 67;
    vpri[15] = 71;
    var y = 0;
    var x = 0;
    for (var i = 0; i < z; i++) {
      y = myNit.substr(i, 1);
      x += y * vpri[z - i];
    }
    y = x % 11;
    return y > 1 ? 11 - y : y;
  }

  static getFormData() {
    let data = {};
    let els = document
      .querySelector(".index-form")
      .querySelectorAll("input, select");
    for (let i = 0; i < els.length; i++) {
      let v = els[i].value;
      if (v !== "") {
        data[els[i].getAttribute("name")] = v;
      }
    }
    return data;
  }

  static savePdfInfo() {
    let pdfinfo = store.getState().pdf_info;
    pdfinfo = {
      ...pdfinfo,
      ...Helpers.getFormData()
    };
    store.dispatch(savePdfInfo(pdfinfo));
  }

  static updatePdfInfo(data) {
    let pdfinfo = store.getState().pdf_info;
    pdfinfo = {
      ...pdfinfo,
      ...data
    };
    store.dispatch(savePdfInfo(pdfinfo));
  }

  static clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  }

  static cloneObject(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = Helpers.clone(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = Helpers.clone(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }
}

export default Helpers;
