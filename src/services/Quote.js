import Api from './Api';
import Store from '../store';
import Helpers from "../common/helpers/helpers/Helpers";

const Url = "/quote";

class IdentificationsCities {
    static async save() {
        let storeState = Store.getState();
        let user = await Helpers.getUser();
        let newUser = {};
        if (user !== null) for (let i in user) if (i !== 'accessToken' && i !== 'refer') newUser[i] = user[i];
        let data = {
            quoteId: storeState.cotizacion.number,
            document_type: parseInt(storeState.cotizacion.identification.code),
            document_number: storeState.cotizacion.identification.value,
            business_name: storeState.cotizacion.identification.businessname,
            city: parseInt(storeState.cotizacion.identification.city),
            department: parseInt(storeState.cotizacion.identification.department),
            address: storeState.cotizacion.identification.address,
            address_additional: storeState.cotizacion.identification.addressadditional,
            latitude: storeState.mapsOptions.latitude,
            longitude: storeState.mapsOptions.longitude,
            name: storeState.cotizacion.identification.name,
            last_name: storeState.cotizacion.identification.lastname,
            step: storeState.cotizacion.state,
            person: storeState.cotizacion.identification.object,
            pdf_info: storeState.pdf_info,
            intntermediate: newUser,
            policy: {
                emissionId: storeState.cotizacion.identification.emissionId,
                emitedDate: storeState.cotizacion.identification.emitedDate,
            }
        };
        for (let i in data) if (data[i] === "") data[i] = '""';
        return await Api.post(Url, data);
    };
}

export default IdentificationsCities;
