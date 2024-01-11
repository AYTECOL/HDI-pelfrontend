import { UrlSite } from '../../../config';
import Identifications from '../../../services/GetQuote';
import store from '../../../store';
import {
  restoreCotizacion,
  restoreCotizacionRisk,
  saveProspect,
} from '../../../store/actions';
import ValorationById from '../../../services/ValorationById';
import { DEFAULT_VALUE_TYPE_DOCUMENT } from 'assets/constants';

class Helpers {
  static toCapitalize(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
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

  static capitalize = (value) => {
    if (!value) return '';
    return `${value.charAt(0)}${value.slice(1).toLowerCase()}`;
  };

  static disabled(selector) {
    let el = document.querySelector(selector);
    let className = 'disabled';
    if (el != null) {
      if (el.className.indexOf(className) === -1) {
        el.className += ' ' + className;
        el.setAttribute(className, true);
      }
    }
  }

  static enabled(selector) {
    let el = document.querySelector(selector);
    let className = 'disabled';
    if (el != null) {
      if (el.className.indexOf(className) !== -1) {
        el.className = el.className.replace(' ' + className, '');
        el.removeAttribute(className);
      }
    }
  }

  static addClass(selector, className) {
    let el = document.querySelector(selector);
    if (el != null) {
      if (el.className.indexOf(className) === -1) {
        el.className += ' ' + className;
      }
    }
  }

  static removeClass(selector, className) {
    let el = document.querySelector(selector);
    if (el != null) {
      el.className = el.className.replace(' ' + className, '');
    }
  }

  static scrollElement(size, scrollElement, inverse) {
    if (typeof scrollElement === 'undefined') {
      scrollElement = window;
    } else {
      scrollElement = document.querySelector(scrollElement);
    }
    if (typeof inverse === 'undefined') inverse = false;
    let scrollTop = scrollElement.scrollTop;
    scrollElement.scroll({
      top: inverse ? scrollTop - size : scrollTop + size,
      left: 0,
      behavior: 'smooth',
    });
  }

  static scrollToElement(selector, scrollElement, behavior, ignoreZero) {
    let el = document.querySelector(selector);
    let top;

    if (typeof ignoreZero === 'undefined') ignoreZero = false;

    function findValue(value) {
      if (
        value.offsetTop === 0 &&
        value.offsetParent !== null &&
        ignoreZero === false
      ) {
        return findValue(value.offsetParent);
      } else {
        return value.offsetTop;
      }
    }

    top = findValue(el);
    if (top === 0) return;
    if (typeof scrollElement === 'undefined') behavior = 'smooth';
    if (typeof scrollElement === 'undefined') {
      scrollElement = window;
    } else {
      scrollElement = document.querySelector(scrollElement);
    }
    scrollElement.scroll({
      top: top,
      left: 0,
      behavior: behavior,
    });
  }

  static orderArray(array, key) {
    return array.sort(function (a, b) {
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
    history.push(UrlSite + '/404');
  }

  static goToHome(history) {
    history.push(UrlSite + '/');
  }

  static goToError() {
    if (window.location.pathname !== '/error') {
      window.location.href = UrlSite + '/error';
    }
  }

  static async getRowById(id, step, history) {
    let cotizacion = await Identifications.getById(id);
    if (typeof cotizacion.identification !== 'undefined') {
      store.dispatch(restoreCotizacion(cotizacion));
      if (cotizacion.state === 7) {
        Helpers.goToNotFound(history);
      } else {
        if (cotizacion.state >= 2 && parseInt(step) >= 2) {
          let riskData = await ValorationById.get(id);
          if (riskData !== null) {
            await store.dispatch((dispatch) => {
              dispatch(
                saveProspect({
                  prospect: riskData.prospect,
                  total_premium_policy: riskData.total_premium_policy,
                  expedition_expenses: riskData.expedition_expenses,
                  total_tax_policy: riskData.total_tax_policy,
                  iva_expedition_expenses: riskData.iva_expedition_expenses,
                })
              );
              dispatch(restoreCotizacionRisk(riskData));
              return Promise.resolve();
            });
          }
        }
      }
    } else if (
      typeof cotizacion.status !== 'undefined' &&
      parseInt(step) !== 1
    ) {
      if (cotizacion.status === 400) {
        Helpers.goToNotFound(history);
      } else if (cotizacion.status === 0) {
        Helpers.goToHome(history);
      }
    }
  }

  static toggleSlide = (index) => () => {
    let className = 'close_item';
    if (Helpers.hasClass('.row_tab_' + index, className)) {
      Helpers.removeClass('.row_tab_' + index, className);
    } else {
      let el = document.querySelector('.row_tab_' + index + ' .wrapper-box ');
      if (el == null)
        el = document.querySelector('.row_tab_' + index + ' .wrapper-box-info');
      el.style.height = el.offsetHeight + 'px';
      Helpers.addClass('.row_tab_' + index, className);
    }
  };

  static fileFormats = ['image/*', 'application/pdf'];

  static validateFile(file) {
    if (typeof file !== 'undefined') {
      return Helpers.fileFormats.some((format) => file.type.match(format));
    }
  }

  static validationEmail(email) {
    let value = String(email).toLowerCase();

    // var re =
    //   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // return re.test(value);

    if (
      !/^[A-Za-z0-9.~!ñÑ#$%&'()*+/=?^_`{|}-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/.test(
        value
      )
    ) {
      return false;
    }

    if (value.startsWith('.')) {
      return false;
    }
    // Validación de no tener dos puntos consecutivos (..)
    if (value.includes('..')) {
      return false;
    }

    // // Validación de no tener un punto ó - antes del @
    if (
      (value.indexOf('@') > 0 &&
        value
          .substring(value.indexOf('@') - 1, value.indexOf('@'))
          .includes('.')) ||
      (value.indexOf('@') > 0 &&
        value
          .substring(value.indexOf('@') - 1, value.indexOf('@'))
          .includes('-'))
    ) {
      if (
        (value.includes('@outlook') || value.includes('@hotmail')) &&
        value.indexOf('@') > 0 &&
        value
          .substring(value.indexOf('@') - 1, value.indexOf('@'))
          .includes('-')
      ) {
        return true;
      }
      if (value.includes('@outlook') || value.includes('@hotmail')) {
        return false;
      }

      return false;
    }
    if (value.includes('ñ') || value.includes('Ñ')) {
      return false;
    }
    const afterAt = value.split('@')[1];
    if (afterAt && afterAt.length > 255) {
      return false;
    }
    if (
      afterAt.charAt(0) === '.' ||
      afterAt.charAt(afterAt.length - 1) === '-' ||
      afterAt.charAt(afterAt.length - 1) === '.'
    ) {
      return false;
    }
    if (afterAt) {
      const domain = afterAt.split('.')[0];

      if (
        domain &&
        (domain.charAt(0) === '-' || domain.charAt(domain.length - 1) === '.')
      ) {
        return false;
      }
    }
    // Validación de dominio con al menos 2 caracteres
    if (afterAt) {
      const domain = afterAt.split('.')[1];
      if (domain !== undefined) {
        if (domain.length < 2) {
          return false;
        }
      }
    }

    const parts = value.split('@');
    if (parts.length !== 2 || parts[0].length > 64) {
      return false;
    }

    const beforeAt = value.split('@')[0];
    // Validación para Outlook/Hotmail
    if (value.includes('@outlook') || value.includes('@hotmail')) {
      // Debe iniciar con letra 'Outlook/Hotmail debe iniciar con letra y no permite iniciar con mayusculas'
      if (!/^[a-z]/.test(beforeAt)) {
        return false;
      }
      // No permite caracteres especiales a excepción de 'Outlook/Hotmail no permite caracteres especiales, excepto _, . y -'
      if (!/^[a-zA-Z0-9_.-]+$/.test(beforeAt)) {
        return false;
      }
      // No permite 'Outlook/Hotmail no permite terminar con punto'
      if (beforeAt.endsWith('.')) {
        return false;
      }
    }

    // Validación para Yahoo
    if (value.includes('@yahoo')) {
      // Debe iniciar con letra 'Yahoo debe iniciar con letra y no permite iniciar con mayusculas'
      if (!/^[a-z]/.test(beforeAt)) {
        return false;
      }
      // No permite caracteres especiales a excepción de guión bajo y punto 'Yahoo no permite caracteres especiales, excepto _ y .'
      if (!/^[a-zA-Z0-9_.]+$/.test(beforeAt)) {
        return false;
      }
      // Debe terminar con letra o número 'Yahoo debe terminar con letra o número'
      if (!/[a-zA-Z0-9]$/.test(beforeAt)) {
        return false;
      }
      // No permite más de un punto o guion bajo seguidos 'Yahoo no permite más de un punto o guion bajo seguidos'
      if (beforeAt.includes('..') || beforeAt.includes('__')) {
        return false;
      }
    }

    // Validación para Gmail
    if (value.includes('@gmail')) {
      // 'Gmail debe comenzar con letra o número y no permite iniciar con mayusculas'
      if (!/^[a-z0-9]/.test(beforeAt.charAt(0))) {
        return false;
      }
      // 'Gmail no permite caracteres especiales, excepto punto'
      if (!/^[a-zA-Z0-9.]+$/.test(beforeAt)) {
        return false;
      }
      // 'Gmail no permite iniciar con punto'
      if (beforeAt.charAt(0) === '.') {
        return false;
      }
      // No permite puntos al final 'Gmail no permite terminar con punto'
      if (beforeAt.endsWith('.')) {
        return false;
      }
      // No permite guion bajo en ninguna posición 'Gmail no permite guion bajo en ninguna posición'
      if (beforeAt.includes('_')) {
        return false;
      }
    }
  }
  static validationEmailErros(email) {
    let value = String(email).toLowerCase();

    // var re =
    //   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // return re.test(value);

    if (
      !/^[A-Za-z0-9.~!ñÑ#$%&'()*+/=?^_`{|}-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/.test(
        value
      )
    ) {
      return 'Ingresa el @ o caracteres válidos “!”,“#”,“$”,“%”,“&”,“”,“’”,“*”,“+”,“-”,“/”,“=“,”?”,“^”,“_”,“`”,“{“,“|”,“}”';
    }

    if (value.startsWith('.')) {
      return 'El primer carácter no puede ser un punto (.)';
    }
    // Validación de no tener dos puntos consecutivos (..)
    if (value.includes('..')) {
      return 'No se permiten dos puntos consecutivos (..)';
    }

    // // Validación de no tener un punto ó - antes del @
    if (
      (value.indexOf('@') > 0 &&
        value
          .substring(value.indexOf('@') - 1, value.indexOf('@'))
          .includes('.')) ||
      (value.indexOf('@') > 0 &&
        value
          .substring(value.indexOf('@') - 1, value.indexOf('@'))
          .includes('-'))
    ) {
      if (
        (value.includes('@outlook') || value.includes('@hotmail')) &&
        value.indexOf('@') > 0 &&
        value
          .substring(value.indexOf('@') - 1, value.indexOf('@'))
          .includes('-')
      ) {
        return true;
      }
      if (value.includes('@outlook') || value.includes('@hotmail')) {
        return 'Outlook/Hotmail no permite un punto antes del @';
      }

      return 'No se permite un punto ó un - antes del @';
    }
    if (value.includes('ñ') || value.includes('Ñ')) {
      return 'No se permite la tecla ñ';
    }
    const afterAt = value.split('@')[1];
    if (afterAt && afterAt.length > 255) {
      return 'Después del @ no puede tener más de 255 caracteres';
    }
    if (
      afterAt &&
      (afterAt.charAt(0) === '.' ||
        afterAt.charAt(afterAt.length - 1) === '-' ||
        afterAt.charAt(afterAt.length - 1) === '.')
    ) {
      return 'El dominio no puede comenzar con "-" ni terminar con "." o terminar con "-"';
    }
    if (afterAt) {
      const domain = afterAt.split('.')[0];
      if (
        domain &&
        (domain.charAt(0) === '-' || domain.charAt(domain.length - 1) === '.')
      ) {
        return 'El dominio no puede comenzar con "-" ni terminar con "." o terminar con "-"';
      }
    }
    // Validación de dominio con al menos 2 caracteres
    if (afterAt) {
      const domain = afterAt.split('.')[1];
      if (domain !== undefined) {
        if (domain.length < 2) {
          return 'El dominio debe tener al menos 2 caracteres';
        }
      }
    }

    const parts = value.split('@');
    if (parts.length !== 2 || parts[0].length > 64) {
      return 'El correo electrónico debe tener maximo 64 caracteres antes del @';
    }

    const beforeAt = value.split('@')[0];
    // Validación para Outlook/Hotmail
    if (value.includes('@outlook') || value.includes('@hotmail')) {
      if (beforeAt.endsWith('.')) {
        return 'Outlook/Hotmail no permite terminar con punto';
      }
      // Debe iniciar con letra 'Outlook/Hotmail debe iniciar con letra y no permite iniciar con mayusculas'
      if (!/^[a-z]/.test(beforeAt)) {
        return 'Outlook/Hotmail debe iniciar con letra y no permite iniciar con mayusculas';
      }
      // // No permite caracteres especiales a excepción de 'Outlook/Hotmail no permite caracteres especiales, excepto _, . y -'
      if (!/^[a-zA-Z0-9_.-]+$/.test(beforeAt)) {
        return 'Outlook/Hotmail no permite caracteres especiales, excepto _, . y -';
      }
      // No permite 'Outlook/Hotmail no permite terminar con punto'
    }

    // Validación para Yahoo
    if (value.includes('@yahoo')) {
      // Debe iniciar con letra 'Yahoo debe iniciar con letra y no permite iniciar con mayusculas'
      if (!/^[a-z]/.test(beforeAt)) {
        return 'Yahoo debe iniciar con letra y no permite iniciar con mayusculas';
      }
      // No permite caracteres especiales a excepción de guión bajo y punto 'Yahoo no permite caracteres especiales, excepto _ y .'
      if (!/^[a-zA-Z0-9_.]+$/.test(beforeAt)) {
        return 'Yahoo no permite caracteres especiales, excepto _ y .';
      }
      // Debe terminar con letra o número 'Yahoo debe terminar con letra o número'
      if (!/[a-zA-Z0-9]$/.test(beforeAt)) {
        return 'Yahoo debe terminar con letra o número';
      }
      // No permite más de un punto o guion bajo seguidos 'Yahoo no permite más de un punto o guion bajo seguidos'
      if (beforeAt.includes('..') || beforeAt.includes('__')) {
        return 'Yahoo no permite más de un punto o guion bajo seguidos';
      }
    }

    // Validación para Gmail
    if (value.includes('@gmail')) {
      // 'Gmail debe comenzar con letra o número y no permite iniciar con mayusculas'
      if (!/^[a-z0-9]/.test(beforeAt.charAt(0))) {
        return 'Gmail debe comenzar con letra o número y no permite iniciar con mayusculas';
      }
      // 'Gmail no permite caracteres especiales, excepto punto'
      if (!/^[a-zA-Z0-9.]+$/.test(beforeAt)) {
        return 'Gmail no permite caracteres especiales, excepto punto';
      }
      // 'Gmail no permite iniciar con punto'
      if (beforeAt.charAt(0) === '.') {
        return 'Gmail no permite iniciar con punto';
      }
      // No permite puntos al final 'Gmail no permite terminar con punto'
      if (beforeAt.endsWith('.')) {
        return 'Gmail no permite terminar con punto';
      }
      // No permite guion bajo en ninguna posición 'Gmail no permite guion bajo en ninguna posición'
      if (beforeAt.includes('_')) {
        return 'Gmail no permite guion bajo en ninguna posición';
      }
    }
  }

  static isMobilePhone(value) {
    const regex = /^(3[\d]{9,9}$)/;
    return !regex.test(String(value));
  }

  static isTelephone(value) {
    const regex = /(^[\d]{5,15}$)/;
    return !regex.test(String(value));
  }

  static isNumber(value) {
    const regex = /^\d+$/g;
    return regex.test(value);
  }

  static fieldNumeric = function () {
    let els = document.querySelectorAll('input.number');

    function validateNumber(e) {
      if (typeof e.which !== 'undefined') {
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
      e.target.value = e.target.value.replace(/\.(?=\.)|G(?!^)\.|`|,/gm, '');
    }

    const events = ['input', 'change', 'paste', 'keypress'];
    for (const element of els) {
      for (const event of events) {
        element.addEventListener(event, validateNumber);
      }
    }
  };

  static calcularDigitoVerificacion(myNit) {
    // Se limpia el Nit
    myNit = myNit.toString();
    myNit = myNit.replace(/\s/g, ''); // Espacios
    myNit = myNit.replace(/,/g, ''); // Comas
    myNit = myNit.replace(/\./g, ''); // Puntos
    myNit = myNit.replace(/-/g, ''); // Guiones
    // Se valida el nit
    if (isNaN(myNit)) {
      return '';
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

  static clone(obj) {
    if (null == obj || 'object' != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
      if (Object.hasOwnProperty.call(obj, attr)) copy[attr] = obj[attr];
    }
    return copy;
  }

  static cloneObject(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' != typeof obj) return obj;

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
        if (Object.hasOwnProperty.call(obj, attr))
          copy[attr] = Helpers.clone(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  static getDataBasicPersonIaxis({ consultarPersonaRs }, typeDocument) {
    const { persona, personaRestringida } = consultarPersonaRs;
    if (+typeDocument === DEFAULT_VALUE_TYPE_DOCUMENT) {
      return {
        data: {
          typeDocument: persona?.tipoDocumento?.codigo || '',
          document: persona?.numeroDocumento || '',
          name: persona?.personaNatural?.primerNombre || '',
          secondName: persona?.personaNatural?.segundoNombre || '',
          lastName: persona?.personaNatural?.primerApellido || '',
          secondLastName: persona?.personaNatural?.segundoApellido || '',
        },
        restricted: personaRestringida || false,
      };
    } else {
      return {
        data: {
          typeDocument: persona?.tipoDocumento?.codigo || '',
          document: persona?.numeroDocumento || '',
          reasonSocialName: persona?.personaJuridica?.razonSocial || '',
        },
        restricted: personaRestringida || false,
      };
    }
  }

  static formatNumberUnit(number) {
    const options2 = { style: 'unit' };
    const format = new Intl.NumberFormat(options2);
    return format.format(+number);
  }
}

export default Helpers;
