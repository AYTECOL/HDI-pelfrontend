import Api from './Api';
import ConsultaPersonas from './ConsultaPersonas';
import AuthHeader from './AuthHeader';
const routeEmit = '/emit-policy';
const routeBeneficiariesFinal = '/emit-sarlaft-juridic-person';

class Policy {
  static async emit(quoteId, data) {
    let user = await ConsultaPersonas.getUser();
    let authHeader = new AuthHeader();
    authHeader = authHeader.generateAuthCode();
    authHeader['pelhauthorization'] = user !== null ? user['accessToken'] : '';
    return await Api.post(routeEmit, data, undefined, undefined, authHeader);
  }

  /**
   *
   * @param {import('../services/QuoteIussedById').QuoteIussed} data
   * @returns {Promise<any>}
   */
  static async emitSarlaftJuridicPerson(req) {
    // only, if the policy is juridic person and beneficiariesFinal & legal representative is not empty
    const {
      quote_iussed_info: { Item },
    } = req;
    const {
      beneficiariesFinal = [],
      legalRepresentative = null,
      taker = null,
    } = Item || {};
    if (beneficiariesFinal.length === 0 && legalRepresentative === null) return;
    const takerData = {
      document_type: taker?.document_type || '',
      document_number: taker?.document || '',
      businessname: taker?.businessname || '',
      address: taker?.address || '',
      city_code: taker?.city_code || '',
      department_code: taker?.department_code || '',
      phone: taker?.phone || '',
      email: taker?.email || '',
    };
    const data = {
      beneficiariesFinal,
      legalRepresentative,
      taker: takerData,
    };
    const user = await ConsultaPersonas.getUser();
    let authHeader = new AuthHeader();
    authHeader = authHeader.generateAuthCode();
    authHeader['pelhauthorization'] = user !== null ? user['accessToken'] : '';
    return await Api.post(
      routeBeneficiariesFinal,
      data,
      undefined,
      undefined,
      authHeader
    );
  }
}

export default Policy;
