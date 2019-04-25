import Service from './Service';

const Url = "/quote/";

class GetIdentifications {
    static async get() {
        return await Service.get(Url);
    };

    static async getById(id) {
        try {
            let items = await Service.get(Url + id);
            if (typeof items.quote !== 'undefined') {
                items = items.quote;
                for (let i in items) if (items[i] === '""') items[i] = "";
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
                    mapsOptions: {
                        longitude: items.longitude,
                        latitude: items.latitude,
                        options: {
                            zoom: 20
                        }
                    },
                    stateFormIdentificacion: 1,
                    showMap: true
                };
            } else {
                return {};
            }
        } catch (e) {
            return {};
        }
    }
}

export default GetIdentifications;
