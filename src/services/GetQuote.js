import Api from './Api';
import Helpers from '../common/helpers/helpers';
import AccessToken from '../services/AccessToken';
import AuthHeader from './AuthHeader';
import { STATUS } from 'assets/constants';
const Url = '/quote-all-quotes/';
const url_plan_selected = '/quotes-plan-selected';
const url_more_info_policies = '/quotes-more-info';

class GetQuote {
  static async get() {
    let queryString = window.location.search.replace('?', '').split('&');
    await AccessToken.get(queryString[0].replace('refer=', ''));
    const intermediateCode = localStorage.getItem('intermediateCode') || '';
    let authHeader = new AuthHeader();
    authHeader = authHeader.generateAuthCode();
    const quotations = [];
    const status = Object.values(STATUS);
    for (const state of status) {
      let items = await Api.get(
        `${Url}${intermediateCode}/${state}`,
        undefined,
        authHeader
      );
      if (items.quotations.length > 0) quotations.push(...items.quotations);
    }

    return Helpers.orderArray(quotations, 'quoteId', true).reverse();
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

  static async getMoreInfoPolicies(quoteIds) {
    // TODO intercept request
    let authHeader = new AuthHeader();
    authHeader = authHeader.generateAuthCode();
    return await Api.post(
      url_more_info_policies,
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
