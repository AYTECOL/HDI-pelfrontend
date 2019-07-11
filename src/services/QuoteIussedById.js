import Api from "./Api";

const BaseUrl = "/get/all/quote-iussed-by-id/";

class QuoteIussedById {

    static mergeUsers(data) {
        if (typeof data.quote_iussed_info !== "undefined") {
            if (typeof data.quote_iussed_info.Item !== "undefined") {
                let users = [];
                let item = data.quote_iussed_info.Item;
                ['taker', 'insured', 'benefist'].map(it => {
                    if (it === 'taker') item[it] = [item[it]];
                    for (let i = 0; i < item[it].length; i++) {
                        let u = item[it][i];
                        let key = u.document + "_" + u.document_type;
                        if (typeof users[key] === "undefined") {
                            users[key] = u;
                        }
                    }
                    item[it] = [];
                    return this;
                });
                for (let i in users) {
                    let status = false;
                    for (let j = 0; j < users[i].role.length; j++) {
                        let role = users[i].role[j];
                        if (status === false) {
                            if (role === 1) {
                                // Tomador
                                data.quote_iussed_info.Item['taker'] = users[i];
                                status = true;
                            } else if (role === 2) {
                                // Asegurado
                                data.quote_iussed_info.Item['insured'].push(users[i]);
                                status = true;
                            } else if (role === 3) {
                                // Beneficiario
                                data.quote_iussed_info.Item['benefist'].push(users[i]);
                                status = true;
                            }
                        }
                    }
                }
            }
        }
        return data;
    }

    static async get(id) {
        return QuoteIussedById.mergeUsers(await Api.get(BaseUrl + id));
    }
}

export default QuoteIussedById;
