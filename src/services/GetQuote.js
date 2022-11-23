import Api from './Api';
import Helpers from '../common/helpers/helpers';
import AccessToken from '../services/AccessToken';
import AuthHeader from './AuthHeader';
const Url = '/quote-all-quotes/';
const url_plan_selected = '/quotes-plan-selected';

class GetQuote {
  static async get() {
    let queryString = window.location.search.replace('?', '').split('&');
    await AccessToken.get(queryString[0].replace('refer=', ''));
    const accessToken = localStorage.getItem('JaccessToken') || '';
    let authHeader = new AuthHeader();
    authHeader = authHeader.generateAuthCode();
    let items = await Api.get(`${Url}${accessToken}`, undefined, authHeader);
    if (typeof items.quotations === 'undefined') {
      return [];
    } else {
      return Helpers.orderArray(items.quotations, 'quoteId', true).reverse();
    }
  }

  static async getById(id) {
    try {
      let authHeader = new AuthHeader();
      authHeader = authHeader.generateAuthCode();
      let items = await Api.get('/quote/' + id, undefined, authHeader);
      if (typeof items.quote !== 'undefined') {
        items = items.quote;
        for (let i in items) if (items[i] === '""') items[i] = '';
        items.policy = typeof items.policy === 'undefined' ? {} : items.policy;
        return {
          number: items.quoteId,
          typeDocument: parseInt(items.document_type) === 37 ? 2 : 1,
          state: items.step,
          identification: {
            code: items.document_type,
            value: items.document_number,
            name: items.name,
            lastname: items.last_name,
            businessname: items.business_name,
            city: items.city,
            department: items.department,
            address: items.address,
            addressadditional: items.address_additional,
            object: items.person,
            emissionId: items.policy.emissionId,
            emitedDate: items.policy.emitedDate,
          },
          mapsOptions: {
            longitude: items.longitude,
            latitude: items.latitude,
            options: {
              zoom: 20,
            },
          },
          stateFormIdentificacion: 1,
          showMap: true,
        };
      } else {
        return {};
      }
    } catch (e) {
      return e;
    }
  }

  static async getPlanSelected(quoteIds) {
    // TODO intercept request
    let authHeader = new AuthHeader();
    authHeader = authHeader.generateAuthCode();
    return await Api.post(
      url_plan_selected,
      {
        quotes: quoteIds,
      },
      undefined,
      undefined,
      authHeader
    );
  }
}

export default GetQuote;
