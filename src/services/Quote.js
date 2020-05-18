import Api from './Api';
import Store from '../store';
import ConsultaPersonas from './ConsultaPersonas';
import AccessTokenGeocoding from './AccessTokenProd';
import SigService from './SigServices';
const Url = '/quote';

class IdentificationsCities {
  static async save() {
    let storeState = Store.getState();
    let accessToken = await AccessTokenGeocoding.get();
    let infoGeocoding = await SigService.LongitudeAndLatitude(accessToken.access_token, storeState.mapsOptions.latitude, storeState.mapsOptions.longitude)
    let user = await ConsultaPersonas.getUser();
    let newUser = {};
    if (user !== null)
      for (let i in user)
        if (i !== 'accessToken' && i !== 'refer') newUser[i] = user[i];
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
      emitedDate
    } = storeState.cotizacion.identification;
    const { attachedFile } = storeState;
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
      pdf_info: storeState.pdf_info,
      intntermediate: newUser,
      policy: {
        emissionId: emissionId,
        emitedDate: emitedDate
      },
      infoGeocodingSig: infoGeocoding.value,
      attachedFile,
    };
    for (let i in data) if (data[i] === '') data[i] = '""';
    return await Api.post(Url, data);
  }
}

export default IdentificationsCities;
