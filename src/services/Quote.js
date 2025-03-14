import Api from './Api';
import Store from '../store';
import ConsultaPersonas from './ConsultaPersonas';
import SigService from './SigServices';
import AuthHeader from './AuthHeader';
const Url = '/quote';
class QuoteService {
  static async save() {
    let storeState = Store.getState();
    const jobId = await SigService.LongitudeAndLatitude(
      storeState.mapsOptions.longitude,
      storeState.mapsOptions.latitude
    );
    const infoGeocoding = await SigService.sigConsumer(jobId);

    const {
      accessToken: _a,
      refer: _b,
      ...user
    } = {
      ...(await ConsultaPersonas.getUser()),
    };
    const {
      code,
      value,
      businessname,
      city,
      department,
      address,
      addressadditional,
      name,
      lastname,
      object,
      emissionId,
      emitedDate,
    } = storeState.cotizacion.identification;
    const { attachedFile, auth } = storeState;
    let data = {
      quoteId: storeState.cotizacion.number,
      document_type: parseInt(code),
      document_number: value,
      business_name: businessname,
      city: parseInt(city),
      department: parseInt(department),
      address: address,
      address_additional: addressadditional ? addressadditional : ' ',
      latitude: storeState.mapsOptions.latitude,
      longitude: storeState.mapsOptions.longitude,
      name: name,
      last_name: lastname,
      step: storeState.cotizacion.state,
      person: object,
      intntermediate: user,
      policy: {
        emissionId: emissionId,
        emitedDate: emitedDate,
      },
      infoGeocodingSig: infoGeocoding,
      attachedFile,
      userAuthCotiza: auth.usuario,
    };
    for (let i in data) if (data[i] === '') data[i] = '""';
    // TODO intercept request
    let authHeader = new AuthHeader();
    authHeader = authHeader.generateAuthCode();
    authHeader['pelhauthorization'] = user !== null ? user['accessToken'] : '';
    return await Api.post(Url, data, undefined, undefined, authHeader);
  }
}

export default QuoteService;
