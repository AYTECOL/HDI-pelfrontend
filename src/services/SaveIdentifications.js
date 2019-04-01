import Service from './Service';
import Store from '../store';

const Url = "https://jdo0rhqwmc.execute-api.us-east-1.amazonaws.com/dev/quote";

//const Url = "http://127.0.0.1:8888/quote";

class IdentificationsCities {
    static async save() {
        let storeState = Store.getState();
        let data = {
            quoteId: storeState.cotizacion.number,
            document_type: parseInt(storeState.cotizacion.identification.code),
            document_number: storeState.cotizacion.identification.value,
            business_name: storeState.cotizacion.identification.businessname,
            city: parseInt(storeState.cotizacion.identification.city),
            address: storeState.cotizacion.identification.address,
            address_additional: storeState.cotizacion.identification.addressadditional,
            latitude: storeState.mapsOptions.latitude,
            longitude: storeState.mapsOptions.longitude,
            name: storeState.cotizacion.identification.name,
            last_name: storeState.cotizacion.identification.lastname,
            step: storeState.cotizacion.state
        };
        for (let i in data) if (data[i] === "") data[i] = '""';
        return await Service.post(Url, data);
    };
}

export default IdentificationsCities;
