import Service from './Service';

const Url = "https://jnvmb2ndq8.execute-api.us-east-1.amazonaws.com/dev/quote/";

class GetIdentifications {
    static async get() {
        return await Service.get(Url);
    };

    static async getById(id) {
        try {
            let items = await Service.get(Url + id);
            if (typeof items.quote !== 'undefined') {
                items = items.quote;
                return {
                    number: items.quoteId,
                    typeDocument: items.document_type === '37' ? 2 : 1,
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
                    },
                    stateFormIdentificacion: 1,
                    showMap: true
                };
            } else {
                return {};
            }
        }catch (e) {
            return {};
        }
    }
}

export default GetIdentifications;
