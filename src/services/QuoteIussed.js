import Api from './Api';
import Store from '../store';

const BaseUrl = "/create-or-update-valoration/";
const EndPoint = "https://tam1avgmn2.execute-api.us-east-1.amazonaws.com/dev";

class CreateOrUpdateValoration {
    static async get() {
        let store = Store.getState();
        let nCotizacion = store.cotizacion.number;
        let risks = store.Inmueble;
        let data = {
            id: {
                type: '',
                default: '',
                required: '',
            },
            taker:{
                first_name: '',
                second_name: '',
                first_last_name: '',
                second_last_name: '',
                document_type: '',
                document: '',
                gender: '',
                birthdate: '',
                phone_type: '',
                phone: '',
                email: '',
                location: '',
                address_type: '',
                address: '',
                sarlaft_document_url: '',
            },
            insured:{
                first_name: '',
                second_name: '',
                first_last_name: '',
                second_last_name: '',
                document_type: '',
                document: '',
                gender: '',
                birthdate: '',
                phone_type: '',
                phone: '',
                email: '',
                location: '',
                address_type: '',
                address: '',
                sarlaft_document_url: '',
            },
            benefist: {
                first_name: '',
                second_name: '',
                first_last_name: '',
                second_last_name: '',
                document_type: '',
                document: '',
                gender: '',
                birthdate: '',
                phone_type: '',
                phone: '',
                email: '',
                location: '',
                address_type: '',
                address: '',
                sarlaft_document_url: '',
            },
            onerous:{
                first_name: '',
                second_name: '',
                first_last_name: '',
                second_last_name: '',
                document_type: '',
                document: '',
                gender: '',
                birthdate: '',
                phone_type: '',
                phone: '',
                email: '',
                location: '',
                address_type: '',
                address: '',
                sarlaft_document_url: '',
            },
            risk_valoration: ''
        };
        for (let i in data) if (data[i] === "") data[i] = '""';
        let response = await Api.post(BaseUrl + nCotizacion, data, EndPoint);
        console.log(response);
        return response;
    };
}

export default CreateOrUpdateValoration;
