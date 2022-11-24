import Api from './Api';
import Helpers from '../common/helpers/helpers';
import AuthHeader from './AuthHeader';
const BaseUrl = '/';

const Default = {
  security: [
    {
      value: false,
      description: 'Vigilancia permanente',
      id: 7,
    },
    {
      value: false,
      description: 'Circuito cerrado de televisión',
      id: 3,
    },
    {
      value: false,
      description: 'Caja fuerte',
      id: 2,
    },
    {
      value: false,
      description: 'Regulador de voltaje',
      id: 4,
    },
    {
      value: false,
      description: 'Puerta de seguridad blindada',
      id: 6,
    },
    {
      value: false,
      description: 'Alarma monitoreada',
      id: 1,
    },
    {
      value: false,
      description: 'Puertas con control domótica',
      id: 5,
    },
  ],
};

class AllSecurity {
  static async get() {
    let url = BaseUrl + 'all-security';
    let security;
    try {
      // TODO interceptor or request
      let authHeader = new AuthHeader();
      authHeader = authHeader.generateAuthCode();
      security = await Api.get(url, undefined, authHeader);
    } catch (e) {
      security = Default;
    }
    if (
      typeof security.security === 'undefined' ||
      security.security.length === 0
    ) {
      security = Default;
    }
    return Helpers.orderArray(security.security, 'id');
  }
}

export default AllSecurity;
