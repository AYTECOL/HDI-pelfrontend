import Api from "./Api";
import Helpers from "../common/helpers/helpers/Helpers";

const Url = "/quote-all-quotes/";

class GetQuote {
    static async get() {
        const accessToken = localStorage.getItem("JaccessToken") || "";
        let items = await Api.get(`${Url}${accessToken}`);
        if (typeof items.quotations === "undefined") {
            return [];
        } else {
            return Helpers.orderArray(items.quotations, "quoteId", true).reverse();
        }
    }

    static async getById(id) {
        try {
            let items = await Api.get("/quote/" + id);
            if (typeof items.quote !== "undefined") {
                items = items.quote;
                for (let i in items) if (items[i] === '""') items[i] = "";
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
                        object: items.person
                    },
                    mapsOptions: {
                        longitude: items.longitude,
                        latitude: items.latitude,
                        options: {
                            zoom: 20
                        }
                    },
                    stateFormIdentificacion: 1,
                    showMap: true,
                    pdf_info: items.pdf_info
                };
            } else {
                return {};
            }
        } catch (e) {
            return e;
        }
    }
}

export default GetQuote;
